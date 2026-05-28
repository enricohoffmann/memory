import { CardComponent } from "../components/card.Component";
import { GameStateStorage } from "../storage/gameState.storage";
import { BoardSize, CompareCardsResult, GameOverResult, GameState, GameStatus, Player, ThemeKey } from "../types/game.types";


/**
 * Encapsulates the core gameplay flow for card selection, matching, scoring, and turn handling.
 *
 * The service manages the in-memory game state, synchronizes changes to storage,
 * and provides helpers for restoring and evaluating the current match.
 */
export class PlayService {

    private _gameState: GameState;
    private _gameStateStor: GameStateStorage;
    private _cardComponents: CardComponent[] = [];
    private _currentPlayer: Player | null;
    private _matchedCards: CardComponent[] = [];

    /**
     * Creates a new play service instance and persists the initial game state.
     *
     * @param gameState The game state used to start or resume gameplay.
     */
    constructor(gameState: GameState) {
        this._gameState = gameState;
        this._gameStateStor = new GameStateStorage();
        this._gameStateStor.setGameState(gameState);
        this._currentPlayer = this.getCurrentPlayer();
    }

    /**
     * Registers a rendered card component for gameplay operations.
     *
     * @param cardComp The card component to add to the managed card list.
     */
    addCardToCardComponents(cardComp: CardComponent): void {
        this._cardComponents.push(cardComp);
    }

    /**
     * Indicates whether exactly two cards are currently selected.
     */
    get twoCardsAlreadySelected(): boolean {
        return this._gameState.selectedCards.length === 2;
    }

    /**
     * Returns the id of the currently active player.
     */
    get currentPlayerId(): string {
        return this._gameState.currentPlayerId;
    }

    /**
     * Returns the active theme key for the current game.
     */
    get themeKey(): ThemeKey {
        return this._gameState.themeKey;
    }

    /**
     * Returns the configured board size for the current game.
     */
    get boardSize(): BoardSize {
        return this._gameState.boardSize;
    }

    /**
     * Returns the current status of the game.
     */
    get gameStatus(): GameStatus {
        return this._gameState.status;
    }

    /**
     * Returns the full mutable game state.
     */
    get gameState(): GameState {
        return this._gameState;
    }

    /**
     * Calculates and returns the final game result, then persists the updated game status.
     */
    get gameOverResult(): GameOverResult {
        const [playerOne, playerTwo] = this._gameState.players;
        const maxScorePlayer = playerOne.score >= playerTwo.score ? playerOne : playerTwo;

        const gameEndResult: GameOverResult = {
            winner: maxScorePlayer,
            gameStatus: playerOne.score === playerTwo.score ? 'draw' : 'won'
        };

        this._gameState.status = gameEndResult.gameStatus;
        this._gameStateStor.setGameState(this._gameState);

        return gameEndResult;

    }

    /**
     * Returns the list of matched card components.
     */
    get matchedCards(): (CardComponent[]) {
        return this._matchedCards;
    }

    /**
     * Checks whether matched cards from a previous state can be restored.
     */
    canRestoreMatchedCards(): boolean {
        return this.gameState.matchedCards && this.gameState.matchedCards.length > 0;
    }

    /**
     * Rebuilds the matched card component list from persisted game state.
     *
     * @returns The restored matched card components.
     */
    restoreMatchedCardsArray(): CardComponent[] {
        this.resetSelectedCards();
        const cards = this._cardComponents.filter(c => this.gameState.matchedCards.includes(c.cardId));
        cards.forEach((card) => {
            card.resetFlipState();
        });
        this._matchedCards = cards;
        this.saveState();
        return this._matchedCards;
    }

    /**
     * Resets all card flip flags when restoring a game state.
     */
    resetCardsForRestore(): void {
        this._cardComponents.forEach((card) => {
            card.resetFlipState();
        });
        this._gameState.cards.forEach((card) => {
            card.isFlipped = false;
        });
        this.saveState();
    }


    /**
     * Returns the score for the player with the provided id.
     *
     * @param playerId The id of the player whose score should be returned.
     * @returns The player's score, or `0` when the player does not exist.
     */
    getScoreByPlayerId(playerId: string): number {
        const player: Player | undefined = this._gameState.players.find(p => p.id === playerId);
        return player?.score ?? 0;
    }

    /**
     * Returns all players in the current game.
     */
    getPlayers(): Player[] {
        return this._gameState.players;
    }

    /**
     * Adds a selected card id to the game state and returns its component.
     *
     * @param cardId The id of the selected card.
     * @returns The matching card component, or `null` if none is registered.
     */
    addSelectedCard(cardId: number): (CardComponent | null) {
        this._gameState.selectedCards.push(cardId);
        this.saveState();
        const currentCardComponent: CardComponent | undefined = this._cardComponents.find(c => c._cardId === cardId);
        return currentCardComponent ? currentCardComponent : null;
    }

    /**
     * Compares the two selected cards and updates score, turn, and match state.
     *
     * @returns A result object describing whether the comparison succeeded, failed, or ended the game.
     */
    compareSelection(): CompareCardsResult {
        const currentCards = this.getCardComponentsFromSelection();
        let result: CompareCardsResult = { result: 'failed' };
        if (!currentCards) { return result; }
        const isEqual = this.areTheCardsTheSame(currentCards);

        if (isEqual) {
            this.setMatchedCards(currentCards);
            this.setScoreFromCurrentPlayer();
            result.result = this.checkIsGameOver() ? 'gameOver' : 'successfully';
            this.saveState();
        } else {
            result.result = 'unsuccessful';
            result.cardsToTurnBack = currentCards;
            this.setNextPlayer();
        }

        return result;
    }

    /**
     * Resets the persisted game state to an idle, empty state.
     */
    quitGameState(): void {
        this._gameState.currentPlayerId = '';
        this._gameState.cards = [];
        this._gameState.selectedCards = [];
        this._gameState.matchedCards = [];
        this._gameState.status = 'idle';
        this.saveState();
    }

    /**
     * Clears currently selected cards in the game state.
     */
    private resetSelectedCards(): void {
        this._gameState.selectedCards = [];
    }

    private setMatchedCards(cardsSelected: CardComponent[]): void {
        if (!this._gameState.matchedCards) {
            this._gameState.matchedCards = [];
        }

        cardsSelected.forEach((card) => {
            this._gameState.matchedCards.push(card.cardId);
            this._matchedCards.push(card);
        });
    }

    private checkIsGameOver(): boolean {
        let playersScore: number = 0;
        this._gameState.players.forEach((player) => {
            playersScore += player.score;
        });

        return this._gameState.cards.length / 2 === playersScore;
    }

    private getCardComponentsFromSelection(): (CardComponent[] | null) {
        const firstCard: CardComponent | undefined = this._cardComponents.find(c => c._cardId === this._gameState.selectedCards[0]);
        const secondCard: CardComponent | undefined = this._cardComponents.find(c => c._cardId === this._gameState.selectedCards[1]);

        if (firstCard === undefined || secondCard === undefined) { return null; }

        const cards: CardComponent[] = [];
        cards.push(firstCard, secondCard);
        return cards;

    }

    private areTheCardsTheSame(cards: CardComponent[]): boolean {
        return cards[0].getCardPairId() === cards[1].getCardPairId();
    }

    private getCurrentPlayer(): (Player | null) {
        const currentPlayer: Player | undefined = this._gameState.players.find(p => p.id === this._gameState.currentPlayerId);
        return currentPlayer ?? null;
    }

    private setScoreFromCurrentPlayer(): void {
        if (this._currentPlayer) {
            this._currentPlayer.score += 1;
        }

    }

    private saveState(): void {
        //console.log(this._gameState);
        
        this._gameStateStor.setGameState(this._gameState);
    }

    /**
     * Clears selected cards and persists the updated state.
     */
    clearSelectedCards(): void {
        this._gameState.selectedCards = [];
        this.saveState();
    }

    /**
     * Switches the turn to the next player and persists the updated state.
     *
     * @returns The next player id, or `null` if no current player is available.
     */
    setNextPlayer(): (string | null) {
        if (!this._currentPlayer) { return null; }
        const currentIndex = this._gameState.players.indexOf(this._currentPlayer);
        const nextIndex = (currentIndex + 1) % this._gameState.players.length;
        this._currentPlayer = this._gameState.players[nextIndex];
        this._gameState.currentPlayerId = this._currentPlayer.id;
        this.saveState();
        return this._currentPlayer.id;
    }



}
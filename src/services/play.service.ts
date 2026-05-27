import { CardComponent } from "../components/card.Component";
import { GameStateStorage } from "../storage/gameState.storage";
import { BoardSize, CompareCardsResult, GameOverResult, GameState, GameStatus, Player, ThemeKey, TrophyType } from "../types/game.types";


export class PlayService {

    private _gameState: GameState;
    private _gameStateStor: GameStateStorage;
    private _cardComponents: CardComponent[] = [];
    private _currentPlayer: Player | null;
    private _matchedCards: CardComponent[] = [];

    constructor(gameState: GameState) {
        this._gameState = gameState;
        this._gameStateStor = new GameStateStorage();
        this._gameStateStor.setGameState(gameState);
        this._currentPlayer = this.getCurrentPlayer();
    }

    addCardToCardComponents(cardComp: CardComponent): void {
        this._cardComponents.push(cardComp);
    }

    get twoCardsAlreadySelected(): boolean {
        return this._gameState.selectedCards.length === 2;
    }

    get currentPlayerId(): string {
        return this._gameState.currentPlayerId;
    }

    get themeKey(): ThemeKey {
        return this._gameState.themeKey;
    }

    get boardSize(): BoardSize {
        return this._gameState.boardSize;
    }

    get gameStatus(): GameStatus {
        return this._gameState.status;
    }

    get gameState(): GameState {
        return this._gameState;
    }

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

    get matchedCards(): (CardComponent[]) {
        return this._matchedCards;
    }

    canRestoreMatchedCards(): boolean {
        return this.gameState.matchedCards && this.gameState.matchedCards.length > 0;
    }

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

    resetCardsForRestore(): void {
        this._cardComponents.forEach((card) => {
            card.resetFlipState();
        });
        this._gameState.cards.forEach((card) => {
            card.isFlipped = false;
        });
        this.saveState();
    }


    getScoreByPlayerId(playerId: string): number {
        const player: Player | undefined = this._gameState.players.find(p => p.id === playerId);
        return player?.score ?? 0;
    }

    getPlayers(): Player[] {
        return this._gameState.players;
    }

    addSelectedCard(cardId: number): (CardComponent | null) {
        this._gameState.selectedCards.push(cardId);
        this.saveState();
        const currentCardComponent: CardComponent | undefined = this._cardComponents.find(c => c._cardId === cardId);
        return currentCardComponent ? currentCardComponent : null;
    }

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

    quitGameState(): void {
        this._gameState.currentPlayerId = '';
        this._gameState.cards = [];
        this._gameState.selectedCards = [];
        this._gameState.matchedCards = [];
        this._gameState.status = 'idle';
        this.saveState();
    }

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
        let playsersScore: number = 0;
        this._gameState.players.forEach((player) => {
            playsersScore += player.score;
        });

        return this._gameState.cards.length / 2 === playsersScore;
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

    clearSelectedCards(): void {
        this._gameState.selectedCards = [];
        this.saveState();
    }

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
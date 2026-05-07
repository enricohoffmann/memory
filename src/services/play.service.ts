import { CardComponent } from "../components/card.Component";
import { GameStateStorage } from "../storage/gameState.storage";
import { BoardSize, CompareCardsResult, GameState, Player, ThemeKey } from "../types/game.types";


export class PlayService {
    
    private _gameState: GameState;
    private _gameStateStor: GameStateStorage;
    private _cardComponents: CardComponent[] = [];
    private _currentPlayer: Player | null;
    
    constructor(gameState: GameState){
        this._gameState = gameState;
        this._gameStateStor = new GameStateStorage();
        this._gameStateStor.setGameState(gameState);
        this._currentPlayer = this.getCurrentPlayer();
    }

    addCardToCardComponents(cardComp: CardComponent):void {
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

    getScoreByPlayerId(playerId: string):number {
        const player:Player | undefined = this._gameState.players.find(p => p.id === playerId);
        return player?.score ?? 0;
    }

    getPlayers(): Player[] {
        return this._gameState.players;
    }

    addSelectedCard(cardId: number): (CardComponent | null) {
        this._gameState.selectedCards.push(cardId);
        this._gameStateStor.setGameState(this._gameState);
        const currentCardComponent: CardComponent | undefined = this._cardComponents.find(c => c._cardId === cardId);
        return currentCardComponent ? currentCardComponent : null;
    }

    compareSelection():CompareCardsResult {
        const currentCards = this.getCardComponentsFromSelection();
        let result: CompareCardsResult = { result: 'failed' };
        if(!currentCards) { return result; }
        const isEqual = this.areTheCardsTheSame(currentCards);
       
        if(isEqual){
            result.result = 'successfully';
            this.setScoreFromCurrentPlayer();
        }else {
            result.result = 'unsuccessful';
            result.cardsToTurnBack = currentCards;
        }

        this.setNextPlayer();
        this.clearSelectedCards();
        return result;
    }

    private getCardComponentsFromSelection(): (CardComponent[] | null ) {
        const firstCard:CardComponent | undefined = this._cardComponents.find(c => c._cardId === this._gameState.selectedCards[0]);
        const secondCard:CardComponent | undefined = this._cardComponents.find(c => c._cardId === this._gameState.selectedCards[1]);

        if(firstCard === undefined || secondCard === undefined) {return null;}

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
        if(this._currentPlayer){
            this._currentPlayer.score += 1;
            this._gameStateStor.setGameState(this._gameState);  
        }
        
    }

    private clearSelectedCards(): void {
        this._gameState.selectedCards = [];
    }

    setNextPlayer():(string | null) {
        if(!this._currentPlayer) { return null; }
        const currentIndex = this._gameState.players.indexOf(this._currentPlayer);
        const nextIndex = currentIndex === 0 ? 1 : 0;
        this._currentPlayer = this._gameState.players[nextIndex];
        this._gameState.currentPlayerId = this._currentPlayer.id;
        this._gameStateStor.setGameState(this._gameState);
        return this._currentPlayer.id;
    }



}
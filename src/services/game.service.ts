import { Player, Card, BoardSize, GameState, Theme, GameConfig } from "../types/game.types";

export class GameService {

    private readonly players:Player[];
    private readonly theme:Theme;
    private boardSize:BoardSize;
    private selectedPlayerId: string;

    constructor(gameConfig:GameConfig){
        this.theme = gameConfig.selectedTheme;
        this.players = gameConfig.players;
        this.boardSize = gameConfig.selectedBoardSize;
        this.selectedPlayerId = gameConfig.selectedStartPlayerId;
    }

    initGame():GameState {
        const facePaths = this.getFacePathsBasedOnBoardSize();
        const cardsRaw = this.createCardSet(facePaths);
        const cardsToPlay = this.shuffleArray(cardsRaw);
        const newGameState = this.createNewGameState( cardsToPlay);
        return newGameState;
    }

    private createNewGameState(cardsToPlay:Card[]):GameState {
        return {
            players: this.players,
            currentPlayerId: this.selectedPlayerId,
            cards:cardsToPlay,
            selectedCards:[],
            themeKey:this.theme.key,
            boardSize:this.boardSize,
            status:'running'
        };
    }

    private getFacePathsBasedOnBoardSize():string[]{
        const fullFacePaths = this.createThemeFacePathsCopy(this.theme.facePaths);
        const shuffledFacePaths:string[] = this.shuffleArray(fullFacePaths);
        const slicedFacePaths:string[] = shuffledFacePaths.slice(0, (this.boardSize.size / 2));
        return slicedFacePaths;
    }

   
    private createCardSet(facePaths:string[]):Card[]{
        let cards:Card[] = [];
        let cardId:number = 0;
        let pairId:number = 0;
        facePaths.forEach((facePath)=>{
            const cardNormal = this.createNewCard(cardId, pairId, facePath);
            cards.push(cardNormal);
            cardId = cardId + 1;
            const cardDuplicated = this.createNewCard(cardId, pairId, facePath);
            cards.push(cardDuplicated);
            cardId = cardId + 1;
            pairId = pairId + 1;
        });
        return cards;
    }

    private createNewCard(cardId:number, pairId:number, facePath:string):Card {
        return {
            id:cardId,
            pairId:pairId,
            facePath:facePath,
            isFlipped:false,
            isMatched:false
        };
    }

    private shuffleArray<T>(arr: T[]):T[]{
        
        for(let currentIndex = arr.length - 1; currentIndex >= 0; currentIndex-- ){
            const targetIndex = this.getRandomIndex(currentIndex);
            const targetTemp = arr[targetIndex];
            arr[targetIndex] = arr[currentIndex];
            arr[currentIndex] = targetTemp;
        }

        return arr;
    }

    private createThemeFacePathsCopy(facePaths:string[]):string[]{
        let copyFacePaths:string[] = [];
        facePaths.forEach((path) => {
            copyFacePaths.push(path);
        });
        return copyFacePaths;
    }

    private getRandomIndex(currentIndex:number):number{
        return Math.floor(Math.random() * (currentIndex + 1));
    }

}
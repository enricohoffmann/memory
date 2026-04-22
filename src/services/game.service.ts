import { Player, ThemeKey, Card, BoardSize, GameState, Theme } from "../types/game.types";
import { ThemeService } from "./theme.service";


export class GameService {

    private players:Player[];
    private readonly theme:Theme;
    private boardSize:BoardSize;

    constructor(players:Player[], theme:Theme, boardSize:BoardSize){
        this.theme = theme;
        this.players = players;
        this.boardSize = boardSize;
    }

    initGame():GameState {
        const facePaths = this.getFacePathsBasedOnBoardSize();
        const cardsRaw = this.createCardSet(facePaths);
        const cardsToPlay = this.shuffleArray(cardsRaw);
        const startPlayerId = this.getStartPlayerId();
        const newGameState = this.createNewGameState(startPlayerId, cardsToPlay);
        return newGameState;
    }

    private createNewGameState(startPlayerId:number, cardsToPlay:Card[]):GameState {
        return {
            players: this.players,
            currentPlayerId: startPlayerId,
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


    private getStartPlayerId():number {
        const currentPlayerIndex = Math.floor(Math.random() * this.players.length);
        return this.players[currentPlayerIndex].id;
    }



}
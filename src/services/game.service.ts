import { Player, ThemeKey, Card, BoardSize } from "../types/game.types";


export class GameService {

    private players:Player[];
    private themeKey:ThemeKey;
    private boardSize:BoardSize;

    constructor(players:Player[], themeKey:ThemeKey, boardSize:BoardSize){
        this.themeKey = themeKey;
        this.players = players;
        this.boardSize = boardSize;
    }

    initGame(){
        const faceKeys = this.getFaceKeysByThemeKey();
        const cardsRaw = this.createCardSet(faceKeys);

    }

    private getFaceKeysByThemeKey():string[]{
        const testArray = ['typeScript', 'python', 'angular'];
        return testArray;
    }

   
    private createCardSet(faceKeys:string[]):Card[]{
        let cards:Card[] = [];
        let cardId:number = 0;
        let pairId:number = 0;
        faceKeys.forEach((faceKey)=>{
            const cardNormal = this.createNewCard(cardId, pairId, faceKey);
            cards.push(cardNormal);
            cardId = cardId + 1;
            const cardDuplicated = this.createNewCard(cardId, pairId, faceKey);
            cards.push(cardDuplicated);
            cardId = cardId + 1;
            pairId = pairId + 1;
        });
        return cards;
    }

    private createNewCard(cardId:number, pairId:number, faceKey:string):Card {
        return {
            id:cardId,
            pairId:pairId,
            faceKey:faceKey,
            isFlipped:false,
            isMatched:false
        };
    }

    private shuffleCards(){
    }





}
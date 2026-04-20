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
        const cardsToPlay = this.shuffleCards(cardsRaw);
        const getStartPlayerId = this.getStartPlayerId();
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

    private copyCard(card:Card):Card{
        return {
            id:card.id,
            pairId:card.pairId,
            faceKey:card.faceKey,
            isFlipped:card.isFlipped,
            isMatched:card.isMatched
        };
    }

    private shuffleCards(originalCards:Card[]):Card[]{
        const copyCards = this.createCardsCopy(originalCards);
        for(let currentIndex = copyCards.length - 1; currentIndex >= 0; currentIndex-- ){
            const targetIndex = this.getRandomIndex(currentIndex);
            const targetCardTemp = copyCards[targetIndex];
            copyCards[targetIndex] = copyCards[currentIndex];
            copyCards[currentIndex] = targetCardTemp;
        }

        return copyCards;
    }

    private createCardsCopy(originalCards:Card[]):Card[]{
        let copyCards:Card[] = [];
        originalCards.forEach((card) => {
            const copyCard = this.copyCard(card);
            copyCards.push(copyCard);
        });
        return copyCards;
    }

    private getRandomIndex(currentIndex:number):number{
        return Math.floor(Math.random() * (currentIndex + 1));
    }


    private getStartPlayerId():number {
        const currentPlayerIndex = Math.floor(Math.random() * this.players.length);
        return this.players[currentPlayerIndex].id;
    }



}
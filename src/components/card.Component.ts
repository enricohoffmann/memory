import { Card, ThemeKey } from "../types/game.types";
import '../styles/components/_card.scss';


export class CardComponent {

    private _cardElement: HTMLElement
    readonly _cardId: number;
    private _isMatched: boolean = false;

    constructor(private card: Card, private themeKey: ThemeKey, private cardSelected: (card: Card) => void) {
        this._cardElement = document.createElement('section');
        this._cardId = this.card.id;
    }

    get isMatched(): boolean {
        return this._isMatched;
    }

    get cardId(){
        return this._cardId;
    }

    setCardMatched(matched: boolean) {
        this._cardElement.classList.add(`is-matched--${this.themeKey}`);
        this._isMatched = matched;
        console.log('match');
        
    }

    buildCard(): HTMLElement {

        this._cardElement.innerHTML = /* html */ `
            <button class='card' id='card-${this._cardId}'>
                <div class='card__inner'>
                    <div class='card__face card__face--back card__face--back-${this.themeKey}'></div>
                    <div class='card__face card__face--front card__face--front-${this.themeKey}'></div>
                </div>
            </button>
        `;

        this.setCardImage();
        this.registerEvent();

        return this._cardElement;
    }

    turnCardBack(): void{
        this.card.isFlipped = false;
        this._cardElement.classList.toggle('is-flipped');
    }

    fipCard():void {
        if(this.card.isFlipped) {return;}
        this.card.isFlipped = true;
        this._cardElement.classList.toggle('is-flipped');
    }

    getCardPairId(): number{
        return this.card.pairId;
    }

    

    private setCardImage(): void {
        const cardInner = this._cardElement.querySelector(`.card__face--front`);
        if (!cardInner) { return; }

        (cardInner as HTMLElement).style.setProperty(
            '--card-image',
            `url("${this.card.facePath}")`
        );
    }

    private registerEvent(): void {
        this._cardElement.addEventListener('click', () => this.cardSelected(this.card));
    }

}
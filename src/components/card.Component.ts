import { Card } from "../types/game.types";
import '../styles/components/_card.scss';


export class CardComponent {

    private _cardElement: HTMLElement

    constructor(private card: Card, private cardSelected: (card: Card) => void) {
        this._cardElement = document.createElement('section');
    }

    buildCard(): HTMLElement {

        this._cardElement.innerHTML = /* html */ `
            <button class='card' id='card-${this.card.id}'>
                <div class='card__inner'>
                    <div class='card__face card__face--back'></div>
                    <div class='card__face card__face--front'></div>
                </div>
            </button>
        `;

        this._cardElement.addEventListener('click', () => this.fipCard());

        this.setCardImage();

        return this._cardElement;
    }

    private fipCard() {
        this.card.isFlipped = true;
        this.cardSelected(this.card);

        this._cardElement.classList.toggle('is-flipped');
    }

    private setCardImage() {
        const cardInner = this._cardElement.querySelector(`.card__face--front`);
        if (!cardInner) { return; }

        (cardInner as HTMLElement).style.setProperty(
            '--card-image',
            `url("${this.card.facePath}")`
        );
    }
}
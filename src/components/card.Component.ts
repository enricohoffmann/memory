import { Card, ThemeKey } from "../types/game.types";
import '../styles/components/_card.scss';


/**
 * Builds and manages a single interactive memory card element.
 *
 * The component renders the card markup, applies the selected theme, tracks local
 * matched state, and forwards selection events to the provided callback.
 */
export class CardComponent {

    private _cardElement: HTMLElement
    readonly _cardId: number;
    private _isMatched: boolean = false;

    /**
     * Creates a new card component instance.
     *
     * @param card The card data model containing identity, pairing, image, and flip state.
     * @param themeKey The active theme used to build theme-specific CSS classes.
     * @param cardSelected Callback that runs when the card is selected.
     */
    constructor(private card: Card, private themeKey: ThemeKey, private cardSelected: (card: Card) => void) {
        this._cardElement = document.createElement('section');
        this._cardId = this.card.id;
    }

    /**
     * Indicates whether the card has been marked as matched.
     */
    get isMatched(): boolean {
        return this._isMatched;
    }

    /**
     * Returns the unique identifier of the card.
     */
    get cardId(): number {
        return this._cardId;
    }

    /**
     * Resets the card model so it is no longer flagged as flipped.
     */
    resetFlipState(): void {
        this.card.isFlipped = false;
    }

    /**
     * Marks the card as matched and applies the corresponding matched state class.
     *
     * @param matched Whether the card should be treated as matched.
     */
    setCardMatched(matched: boolean): void {
        if (matched) {
            this._cardElement.classList.add(`is-matched--${this.themeKey}`);
        } else {
            this._cardElement.classList.remove(`is-matched--${this.themeKey}`);
        }
        this._isMatched = matched;
    }

    /**
     * Builds the card DOM structure, applies the face image, and wires up interaction.
     *
     * @returns The root element containing the rendered card.
     */
    buildCard(): HTMLElement {

        this._cardElement.innerHTML = this.cardHtmlTemplate();
        this.setCardImage();
        this.registerEvent();
        return this._cardElement;
    }

    /**
     * Turns the card back over and updates the card model accordingly.
     */
    turnCardBack(): void {
        this.card.isFlipped = false;
        this._cardElement.classList.toggle('is-flipped');
    }

    /**
     * Flips the card if it is not already flipped.
     */
    flipCard(): void {
        if (this.card.isFlipped) { return; }
        this.card.isFlipped = true;
        this._cardElement.classList.toggle('is-flipped');
    }

    /**
     * Returns the pair identifier used to match this card with its counterpart.
     *
     * @returns The pair identifier of the card.
     */
    getCardPairId(): number {
        return this.card.pairId;
    }

    /**
     * Applies the configured front-face image to the rendered card.
     */
    private setCardImage(): void {
        const cardInner = this._cardElement.querySelector(`.card__face--front`);
        if (!cardInner) { return; }

        (cardInner as HTMLElement).style.setProperty(
            '--card-image',
            `url("${this.card.facePath}")`
        );
    }

    /**
     * Registers the card selection handler on the root element.
     */
    private registerEvent(): void {
        this._cardElement.addEventListener('click', () => this.cardSelected(this.card));
    }

    /**
     * Generates the HTML template for the card component.
     *
     * @returns The HTML string representing the card.
     */
    private cardHtmlTemplate(): string {
        return /* html */ `
      <button class='card' id='card-${this._cardId}'>
        <div class='card__inner'>
          <div class='card__face card__face--back card__face--back-${this.themeKey}'></div>
          <div class='card__face card__face--front card__face--front-${this.themeKey}'></div>
        </div>
      </button>
    `;
    }

}
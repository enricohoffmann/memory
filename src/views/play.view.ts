import { CardComponent } from "../components/card.Component";
import { PlayService } from "../services/play.service";
import { Card, CompareCardsResult, GameState, ViewName } from "../types/game.types";

import '../styles/views/_play.scss';


export class PlayView {

    private _playService: PlayService;

    constructor(
        private gameState: GameState,
        private navigate: (view: ViewName, gameState?: GameState) => void
    ) {
        this._playService = new PlayService(gameState);
    }

    render(container: HTMLElement): void {
        const wrapper = this.buildWrapper();
        const playSection = this.buildPlaySection();
        wrapper.appendChild(playSection);
        const headerSection = this.buildHeaderSection();
        playSection.appendChild(headerSection);
        const mainSection = this.buildMainSection();
        playSection.appendChild(mainSection);

        container.appendChild(wrapper);

        this.showCurrentPlayer();

    }

    initGameState(): boolean {
        return true;
    }

    private buildWrapper(): HTMLElement {
        const wrapper: HTMLElement = document.createElement('div');
        wrapper.classList.add('play-wrapper');
        wrapper.classList.add(`play-wrapper--${this._playService.themeKey}`);
        return wrapper;
    }

    private buildPlaySection(): HTMLElement {
        const playSection: HTMLElement = document.createElement('section');
        playSection.classList.add('play-section');
        return playSection;
    }

    private buildHeaderSection(): HTMLElement {
        const headerSection: HTMLElement = document.createElement('header');
        headerSection.classList.add('header-section');
        headerSection.classList.add(`header-section--${this._playService.themeKey}`);

        headerSection.innerHTML = /* html */ `
            <section class='header-player-section header-player-section--${this._playService.themeKey}'>

                <img class="header-player-section__icon header-player-section__icon--one" alt='Player one icon'/>

                <span class='header-player-section__player-text 
                    header-player-section__player-text--one'>Blue</span>

                <span class='header-player-section__player-score 
                    header-player-section__player-score--one' id='player-01-score'>0</span>

                <img class='header-player-section__icon header-player-section__icon--two' alt='Player two icon'/>

                <span class='header-player-section__player-text 
                    header-player-section__player-text--two'>Orange</span>

                <span class='header-player-section__player-score 
                    header-player-section__player-score--two' id='player-02-score'>0</span>

            </section>

            <div class='header-currentPlayer-container header-currentPlayer-container--${this._playService.themeKey}'>
                <span>Current player:</span>
                <img alt='Current player icon' src='' id='current-player-icon' class='header-currentPlayer-container__current-icon icon-hide'/>
            </div>

            <button class='header-exit-button header-exit-button--${this._playService.themeKey}' type='button'>
                <img src='' alt='Exit icon'/>
                <span>Exit game</span>
            </button>
        `;

        return headerSection;
    }

    private showCurrentPlayer() {
        const playerIcon = document.getElementById('current-player-icon');
        if (!playerIcon) return;

        playerIcon.classList.remove('icon-show');
        playerIcon.classList.add('icon-hide');

        const playerOneClass = 'header-currentPlayer-container__current-icon--one';
        const playerTwoClass = 'header-currentPlayer-container__current-icon--two';

        playerIcon.classList.remove(playerOneClass, playerTwoClass);

        const currentPlayerClass = this._playService.currentPlayerId.endsWith('01') ? playerOneClass : playerTwoClass;

        playerIcon.classList.add(currentPlayerClass);

        requestAnimationFrame(() => {
            playerIcon.classList.remove('icon-hide');
            playerIcon.classList.add('icon-show');
        });


    }

    private buildMainSection(): HTMLElement {
        const mainSection: HTMLElement = document.createElement('main');
        mainSection.classList.add(`playing-field-section`);
        mainSection.classList.add(`playing-field-section--${this._playService.boardSize.rows}-${this._playService.boardSize.columns}`);

        this.gameState.cards.forEach((card) => {
            const cardElement = new CardComponent(card, this._playService.themeKey, (c) => this.cardSelected(c));
            this._playService.addCardToCardComponents(cardElement);
            mainSection.appendChild(cardElement.buildCard());
        });

        return mainSection;
    }

    private cardSelected(card: Card) {

        if (card.isFlipped) { return; }
        if (this._playService.twoCardsAlreadySelected) {
            return;
        }

        const currentCard: CardComponent | null = this._playService.addSelectedCard(card.id);
        if (!currentCard) { return; }

        this.flipSelectedCard(currentCard);

        if (this._playService.twoCardsAlreadySelected) {
            const result: CompareCardsResult = this._playService.compareSelection();
            this.processTheCompareResult(result);
        }

    }

    private async processTheCompareResult(result: CompareCardsResult): Promise<void> {
        if (result.result === 'failed') { return; }
        if (result.result === 'unsuccessful') { await this.turnSelectedCardsBack(result.cardsToTurnBack!); }
        this.showCurrentPlayer();
        if (result.result === 'successfully') { this.showScoreForPlayers(); }
        this._playService.clearSelectedCards();
    }

    private flipSelectedCard(card: CardComponent): void {
        card.fipCard();
    }

    private turnSelectedCardsBack(cards: CardComponent[]): Promise<void> {

        return new Promise((resolve) => {
            setTimeout(() => {
            cards[0].turnCardBack();
            cards[1].turnCardBack();
            resolve();
        }, 2000);
        });

        
    }

    private showScoreForPlayers() {

        const players = this._playService.getPlayers();

        players.forEach((player) => {
            const element = document.getElementById(`${player.id}-score`);
            if (element) {
                element.innerText = String(player.score);
            }
        });

    }

}
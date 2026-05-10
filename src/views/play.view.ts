import { CardComponent } from "../components/card.Component";
import { PlayService } from "../services/play.service";
import { Card, CompareCardsResult, GameState, ViewName } from "../types/game.types";

import '../styles/views/_play.scss';
import { ButtonComponent } from "../components/button.component";
import { PlayerScoreBordComponent } from "../components/playerScoreBoard.component";


export class PlayView {

    private _playService: PlayService;
    private _scoreBoard: PlayerScoreBordComponent;

    constructor(
        private gameState: GameState,
        private navigate: (view: ViewName, gameState?: GameState) => void
    ) {
        this._playService = new PlayService(gameState);
        this._scoreBoard = new PlayerScoreBordComponent(this._playService.themeKey);
    }

    render(container: HTMLElement): void {
        const wrapper = this.buildWrapper();
        const playSection = this.buildPlaySection();
        wrapper.appendChild(playSection);
        const header = this.composeHeader();
        playSection.appendChild(header);
        const mainSection = this.buildMainSection();
        playSection.appendChild(mainSection);
        wrapper.appendChild(this.buildGameOverContainer());
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

    private composeHeader(): HTMLElement {
        const headerSection = this.buildHeaderSection();
        const scoreBoardElement = this._scoreBoard.render();
        headerSection.appendChild(scoreBoardElement);
        const currentPlayerElement = this.buildCurrentPlayerContainer();
        headerSection.appendChild(currentPlayerElement);
        this.renderDialogButton(headerSection);
        return headerSection;
    }

    private buildHeaderSection(): HTMLElement {
        const headerSection: HTMLElement = document.createElement('header');
        headerSection.classList.add('header-section');
        headerSection.classList.add(`header-section--${this._playService.themeKey}`);
        return headerSection;
    }

    private buildCurrentPlayerContainer(): HTMLElement {
        const container: HTMLElement = document.createElement('div');
        container.classList.add('header-currentPlayer-container', `header-currentPlayer-container--${this._playService.themeKey}`);
        container.innerHTML = /* html */ `
            <span>Current player:</span>
            <div id='current-player-icon' class='header-currentPlayer-container__current-icon icon-hide'></div>
        `;
        return container;
    }

    private renderDialogButton(headerSection: HTMLElement){
        const button:ButtonComponent = new ButtonComponent('exit-btn', () => this.showDialog());
        button.renderThemeButton(headerSection, this._playService.themeKey, 'Exit game', true);
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

    private buildGameOverContainer(): HTMLElement {
        const gameOverContainer = document.createElement('div');
        gameOverContainer.classList.add('game-over-container');
        gameOverContainer.id = 'game-over-container';
        return gameOverContainer;
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
        if (result.result === 'successfully') { this._scoreBoard.showScoreForPlayers(this._playService.getPlayers()); }
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

    private showDialog(){

    }

    private showGameOver(): void {
        
    }

}
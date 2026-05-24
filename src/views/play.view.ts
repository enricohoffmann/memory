import { CardComponent } from "../components/card.Component";
import { PlayService } from "../services/play.service";
import { ButtonConfig, Card, CompareCardsResult, GameState, ViewName } from "../types/game.types";

import '../styles/views/_play.scss';
import { ButtonComponent } from "../components/button.component";
import { PlayerScoreBordComponent } from "../components/playerScoreBoard.component";
import { GameOverComponent } from "../components/gameOver.component";
import { EndScreenComponent } from "../components/endScreen.component";
import { DialogComponent } from "../components/dialog.component";


export class PlayView {

    private _playService: PlayService;
    private _scoreBoard: PlayerScoreBordComponent;

    constructor(
        private gameState: GameState,
        private navigate: (view: ViewName, gameState?: GameState) => void
    ) {
        this._playService = new PlayService(gameState);
        this._scoreBoard = new PlayerScoreBordComponent(this._playService.themeKey, 'play');
    }

    render(container: HTMLElement): void {
        let wrapper = this.buildWrapper();
        const playSection = this.buildPlaySection();
        wrapper.appendChild(playSection);
        const header = this.composeHeader();
        playSection.appendChild(header);
        const mainSection = this.buildMainSection();
        playSection.appendChild(mainSection);
        wrapper = this.addOverlayToWrapper(wrapper);
        container.appendChild(wrapper);
        this.showCurrentPlayer();

        //this.handleGameOver();
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

    private addOverlayToWrapper(wrapper: HTMLElement): HTMLElement {
        wrapper.appendChild(this.buildOverlayContainerContainer('exit-dialog'));
        wrapper.appendChild(this.buildOverlayContainerContainer('game-over-container'));
        wrapper.appendChild(this.buildOverlayContainerContainer('play-result-container'));
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

    private renderDialogButton(headerSection: HTMLElement) {
        const btnConfig: ButtonConfig = {
            variant: 'exit-btn', text: 'Exit game', theme: this._playService.themeKey
        };
        const button: ButtonComponent = new ButtonComponent(btnConfig, () => this.showDialog());
        headerSection.appendChild(button.renderButton());
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

    private buildOverlayContainerContainer(elementId: string): HTMLElement {
        const overlayContainer = document.createElement('div');
        overlayContainer.classList.add('overlay-container');
        overlayContainer.id = elementId;
        return overlayContainer;
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
        if (result.result === 'gameOver') { this.handleGameOver(); }
        this.showCurrentPlayer();
        if (result.result === 'successfully') { 
            this._scoreBoard.showScoreForPlayers(this._playService.getPlayers()); 
            this.showMatchedCards();
        }
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
            }, 1000);
        });

    }

    private showMatchedCards(): void {
        const mCards:CardComponent[] = this._playService.matchedCards;

        mCards.forEach((card) => {
            card.setCardMatched(true);
        });
    }

    private showDialog() {
        const exitDialogOverlay = document.getElementById('exit-dialog');
        if (!exitDialogOverlay) { return; }

        const dialogContent: DialogComponent = new DialogComponent(
            this._playService.themeKey,
            () => this.exitThisGame(),
            () => this.closeDialog(dialogContent, exitDialogOverlay));

        exitDialogOverlay.appendChild(dialogContent.renderDialog());
        exitDialogOverlay.classList.add('overlay-container', 'overlay-container--show');

        requestAnimationFrame(() => {
            dialogContent.showDialog();
        });

    }

    private async closeDialog(dialog: DialogComponent, overlay: HTMLElement) {
        const res = await dialog.hideDialog();
        if(res){
            overlay.classList.remove('overlay-container--show');
        }
        
    }

    private exitThisGame() {
        this._playService.quitGameState();
        this.navigate('settings');
    }

    private handleGameOver(): void {
        setTimeout(() => {

            this.showGameOver();

            setTimeout(() => {
                this.showPlayEndScreen();
            }, 1500);

        }, 2000);
    }

    private showGameOver(): void {

        const gameOver = document.getElementById('game-over-container');
        if (gameOver) {

            const gameOverSection: GameOverComponent = new GameOverComponent(this._playService.themeKey);
            const gameOverElement = gameOverSection.buildGameOverElement(this._playService.getPlayers());
            gameOver.appendChild(gameOverElement);

            gameOver.classList.add('overlay-container--slide');

            requestAnimationFrame(() => {
                gameOver.classList.add('overlay-container--show');
            });
        }
    }

    private showPlayEndScreen(): void {
        const endScreen = document.getElementById('play-result-container');
        if (endScreen) {
            const endScreenComponent: EndScreenComponent = new EndScreenComponent(
                this._playService.themeKey, this._playService.gameOverResult, () => this.exitThisGame());

            const endScreenElement = endScreenComponent.render();
            endScreen.appendChild(endScreenElement);



            requestAnimationFrame(() => {
                endScreen.classList.add('overlay-container--slide', 'overlay-container--show');
            });
        }
    }

}
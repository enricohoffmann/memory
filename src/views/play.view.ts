import { GameStates } from "../states/game.state";
import { GameState, ViewName } from "../types/game.types";

export class PlayView {

    private gameStates: GameStates;
    private currentGameState: GameState | null = null;

    constructor(
        private gameState: GameState,
        private navigate: (view: ViewName, gameState?: GameState) => void
    ) {
        this.gameStates = new GameStates();
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
        this.currentGameState = this.gameStates.setGameState(this.gameState);
        return this.currentGameState ? true : false;
    }

    private buildWrapper(): HTMLElement {
        const wrapper: HTMLElement = document.createElement('div');
        wrapper.classList.add('play-wrapper');
        wrapper.classList.add(`play-wrapper--${this.gameState.themeKey}`);
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
        headerSection.classList.add(`header-section--${this.gameState.themeKey}`);

        headerSection.innerHTML = /* html */ `
            <section class='header-player-section header-player-section--${this.gameState.themeKey}'>

                <img class="header-player-section__icon header-player-section__icon--one" alt='Player one icon'/>

                <span class='header-player-section__player-text 
                    header-player-section__player-text--one'>Blue</span>

                <span class='header-player-section__player-score 
                    header-player-section__player-score--one' id='player-one-score'>0</span>

                <img class='header-player-section__icon header-player-section__icon--two' alt='Player two icon'/>

                <span class='header-player-section__player-text 
                    header-player-section__player-text--two'>Orange</span>

                <span class='header-player-section__player-score 
                    header-player-section__player-score--two' id='player-two-score'>0</span>

            </section>

            <div class='header-currentPlayer-container header-currentPlayer-container--${this.gameState.themeKey}'>
                <span>Current player:</span>
                <img alt='Current player icon' src='' id='current-player-icon' class='header-currentPlayer-container__current-icon icon-hide'/>
            </div>

            <button class='header-exit-button header-exit-button--${this.gameState.themeKey}' type='button'>
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

        const currentPlayerClass = this.gameState.currentPlayerId.endsWith('01')
            ? playerOneClass
            : playerTwoClass;

        playerIcon.classList.add(currentPlayerClass);

        requestAnimationFrame(() => {
            playerIcon.classList.remove('icon-hide');
            playerIcon.classList.add('icon-show');
        });


    }

    private buildMainSection(): HTMLElement {
        const mainSection: HTMLElement = document.createElement('main');
        mainSection.classList.add(`playing-field-section`);
        mainSection.classList.add(`playing-field-section--${this.gameState.boardSize.rows}-${this.gameState.boardSize.columns}`);

        this.gameState.cards.forEach((card) => {
            
        });



        return mainSection;
    }

}
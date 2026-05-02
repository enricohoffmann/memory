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
        const mainSection = this.bildMainSection();
        playSection.appendChild(mainSection);

        container.appendChild(wrapper);
        
    }

    initGameState(): boolean{
        this.currentGameState = this.gameStates.setGameState(this.gameState);
        return this.currentGameState ? true : false;
    }

    private buildWrapper(): HTMLElement {
        const wrapper:HTMLElement = document.createElement('div');
        wrapper.classList.add('play-wrapper');
        wrapper.classList.add(`play-wrapper--${this.gameState.themeKey}`);
        return wrapper;
    }

    private buildPlaySection(): HTMLElement {
        const playSection: HTMLElement = document.createElement('section');
        playSection.classList.add('play-section');
        return playSection;
    }

    private buildHeaderSection():HTMLElement {
        const headerSection: HTMLElement = document.createElement('header');
        headerSection.classList.add('header-section');
        headerSection.classList.add(`header-section--${this.gameState.themeKey}`);


        return headerSection;
    }

    private bildMainSection():HTMLElement {
        const mainSection:HTMLElement = document.createElement('main');




        return mainSection;
    }

}

import { ButtonConfig, ViewName } from "../types/game.types";

import '../styles/views/_home.scss';
import { ButtonComponent } from "../components/button.component";
import { GameStateStorage } from "../storage/gameState.storage";

/**
 * Renders the home screen and handles navigation to the settings view.
 *
 * The view builds the static home layout, inserts the play button,
 * and clears persisted game state before starting a new setup flow.
 */
export class HomeView {

    /**
     * Creates a new home view instance.
     *
     * @param navigate Callback used to navigate to another view.
     */
    constructor(private navigate: (view: ViewName) => void) { }

    /**
     * Renders the home view into the provided container element.
     *
     * @param container The target element that should host the view.
     */
    render(container: HTMLElement): void {
        const homeWrapper = this.buildWrapper();
        const homeSection = this.buildHomeSection();
        this.insertButton(homeSection);

        homeWrapper.appendChild(homeSection);

        container.appendChild(homeWrapper);
    }

    /**
     * Builds the outer wrapper element of the home view.
     *
     * @returns The generated wrapper element.
     */
    private buildWrapper(): HTMLElement {
        const wrapper: HTMLElement = document.createElement('div');
        wrapper.classList.add('home-wrapper');
        return wrapper;
    }

    /**
     * Builds the main section markup of the home view.
     *
     * @returns The generated home section element.
     */
    private buildHomeSection(): HTMLElement {
        const homeSection: HTMLElement = document.createElement('section');
        homeSection.classList.add('home-section');

        homeSection.innerHTML = /* html */ `

            <p class='home-section__home-text'>It´s play time.</p>
            <h1 class='home-section__home-headline'>Ready to play?</h1>
            <div class='home-section__home-btn-container'></div>
            <div class='home-icon-container'></div>

        `;

        return homeSection;
    }

    /**
     * Creates and inserts the play button into the home section.
     *
     * @param homeSection The section that contains the button placeholder.
     */
    private insertButton(homeSection: HTMLElement): void {
        const btnContainer: Element | null = homeSection.querySelector('.home-section__home-btn-container');
        if (btnContainer) {

            const btnConfig: ButtonConfig = { variant: 'homePlay-btn', text: 'Play' };
            const button: ButtonComponent = new ButtonComponent(btnConfig, () => this.onButtonClick());
            btnContainer.appendChild(button.renderButton());
        }
    }

    /**
     * Clears persisted game state and navigates to the settings view.
     */
    private onButtonClick(): void {
        const gameStor = new GameStateStorage();
        gameStor.clearGameState();
        this.navigate('settings')
    }

}
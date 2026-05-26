
import { ButtonConfig, ViewName } from "../types/game.types";

import '../styles/views/_home.scss';
import { ButtonComponent } from "../components/button.component";
import { GameStateStorage } from "../storage/gameState.storage";

export class HomeView {

    constructor(private navigate: (view: ViewName) => void) { }

    render(container: HTMLElement): void {
        const homeWrapper = this.buildWrapper();
        const homeSection = this.buildHomeSection();
        this.insertButton(homeSection);

        homeWrapper.appendChild(homeSection);

        container.appendChild(homeWrapper);
    }

    private buildWrapper(): HTMLElement {
        const wrapper: HTMLElement = document.createElement('div');
        wrapper.classList.add('home-wrapper');
        return wrapper;
    }

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

    private insertButton(homeSection: HTMLElement): void {
        const btnContainer: Element | null = homeSection.querySelector('.home-section__home-btn-container');
        if (btnContainer) {

            const btnConfig: ButtonConfig = { variant: 'homePlay-btn', text: 'Play' };
            const button: ButtonComponent = new ButtonComponent(btnConfig, () => this.onButtonClick());
            btnContainer.appendChild(button.renderButton());
        }
    }

    private onButtonClick(): void {
        const gameStor = new GameStateStorage();
        gameStor.clearGameState();
        this.navigate('settings')
    }

}
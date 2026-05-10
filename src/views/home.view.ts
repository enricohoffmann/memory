
import { ViewName } from "../types/game.types";

import '../styles/views/_home.scss';

export class HomeView {

    constructor(private navigate: (view: ViewName) => void) {}

    render(container: HTMLElement): void {
        const homeWrapper = this.buildWrapper();
        const homeSection = this.buildHomeSection();
        this.registerEvent(homeSection);
        homeWrapper.appendChild(homeSection);

        container.appendChild(homeWrapper);
    }

    private buildWrapper():HTMLElement {
        const wrapper: HTMLElement = document.createElement('div');
        wrapper.classList.add('home-wrapper');
        return wrapper;
    }

    private buildHomeSection():HTMLElement {
        const homeSection:HTMLElement = document.createElement('section');
        homeSection.classList.add('home-section');

        homeSection.innerHTML = /* html */ `

            <p class='home-section__home-text'>It´s play time.</p>

            <h1 class='home-section__home-headline'>Ready to play?</h1>

            <div class='home-section__home-btn-container'>

                <button class='home-start-btn'>
                    <div class='home-start-btn__icon home-start-btn__icon--left'></div>
                    <span class='home-start-btn__text'>Play</span>
                    <div class='home-start-btn__arrow'>
                        <div class='home-start-btn__arrow-icon home-start-btn__arrow-icon--default'></div>
                        <div class='home-start-btn__arrow-icon home-start-btn__arrow-icon--hover'></div>
                    </div>
                </button>
            
            </div>

            <div class='home-icon-container'></div>

        `;

        return homeSection;
    }

    private registerEvent(homeSection: HTMLElement): void {
        const btn = homeSection.querySelector('.home-start-btn');
        if(btn) {
            btn.addEventListener('click', () => this.navigate('settings'));
        }
    }
}
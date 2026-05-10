import { ButtonVariant, ThemeKey } from "../types/game.types";
import '../styles/components/_button.scss';


export class ButtonComponent {

    private _button: HTMLButtonElement;

    constructor(private variant: ButtonVariant, private buttonClick: () => void){
        this._button = document.createElement('button');
        this._button.type = 'button';
    }

    renderButton(container: HTMLElement): void {
        if(this.variant === 'home-btn') {this.variantHomeBtn();}
        if(this.variant === 'setting-btn') {this.variantSettingBtn();}
        this.registerEvent();
        container.appendChild(this._button);
    }

    renderThemeButton(container: HTMLElement, theme: ThemeKey, content: string, hasIcon: boolean): void {

        this._button.classList.add('theme-btn', `theme-btn--${theme}`);

        this._button.innerHTML = /* html */ `
            <div class='theme-btn__icon ${hasIcon ? 'theme-btn__icon--visible' : 'theme-btn__icon--hidden'}'></div>
            <span>${content}</span>
        `;

        this.registerEvent();
        container.appendChild(this._button);
    }

    private variantHomeBtn(): void{
        this._button.classList.add('home-start-btn');

        this._button.innerHTML = /* html */ `

            <div class='home-start-btn__icon home-start-btn__icon--left'></div>
            <span class='home-start-btn__text'>Play</span>
            <div class='home-start-btn__arrow'>
                <div class='home-start-btn__arrow-icon home-start-btn__arrow-icon--default'></div>
                <div class='home-start-btn__arrow-icon home-start-btn__arrow-icon--hover'></div>
            </div>

        `;
    }

    private variantSettingBtn(): void {
        this._button.classList.add('setting-start-button', 'setting-start-button--disabled');


        this._button.innerHTML = /* html */ `
            <img src='/src/assets/icons/setting-game.svg' alt='Icon'/>
            <span>Start</span>
        `;
    }


    private registerEvent():void {
        this._button.addEventListener('click', () => this.buttonClick())
    }

    enableButton(): void {
        this._button.classList.remove('setting-start-button--disabled');
    }
}
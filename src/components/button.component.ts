import { ButtonConfig, ButtonVariant, ThemeKey } from "../types/game.types";
import '../styles/components/_button.scss';


export class ButtonComponent {

    private _button: HTMLButtonElement;

    constructor(private config: ButtonConfig, private buttonClick: () => void){
        this._button = document.createElement('button');
        this._button.type = 'button';
        this._button.classList.add('button', `button--${config.variant}`);
    }

    renderButton(): HTMLButtonElement {
        this.applyVariant();
        this.registerEvent();
        return this._button;
    }

    
    private applyVariant(){
        if(this.config.variant === 'homePlay-btn'){this._button.innerHTML = this.getHomePlayButtonTemplate();}
    }

    private registerEvent():void {
        this._button.addEventListener('click', () => this.buttonClick())
    }

    enableButton(): void {
        this._button.classList.remove('setting-start-button--disabled');
    }



    private getHomePlayButtonTemplate(): string {
        return /* html */ `
            <div class='home-start-btn__icon home-start-btn__icon--left'></div>
            <span class='home-start-btn__text'>Play</span>
            <div class='home-start-btn__arrow'>
                <div class='home-start-btn__arrow-icon home-start-btn__arrow-icon--default'></div>
                <div class='home-start-btn__arrow-icon home-start-btn__arrow-icon--hover'></div>
            </div>
        `;
    }

    private getButtonWithIconTemplate(): string {
        return /* html */ `
            <div src='/src/assets/icons/setting-game.svg' ></div>
            <span>Start</span>
        `;
    }


    private getButtonTemplate(): string {
        return /*html*/ `
            <span class='home-start-btn__text'>${this.config.text}</span>
        `;
    }

}
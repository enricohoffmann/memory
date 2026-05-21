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
            <div class='button--homePlay-btn__icon-left'></div>
            <span class='button--homePlay-btn__text'>${this.config.text}</span>
            <div class='button__icons'>
                <div class='button__icons--homePlay-btn button__icons--homePlay-btn--default'></div>
                <div class='button__icons--homePlay-btn button__icons--homePlay-btn--hover'></div>
            </div>
        `;
    }

    private getButtonWithIconTemplate(): string {
        return /* html */ `
            <div class='button-icons-left button-icons-left--${this.config.theme}'>
                <div class='button-icon-left-default'></div>
                <div class='button-icon-left-hover'></div>
            </div>
            <span class='button-text button-text--${this.config.theme}'>${this.config.text}</span>
        `;
    }


    private getButtonTemplate(): string {
        return /*html*/ `
            <span class='button-text button-text--${this.config.theme}'>${this.config.text}</span>
        `;
    }

}
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
        if(this.config.disabled === true){this._button.classList.add(`button--${this.config.variant}--disabled`);}
        return this._button;
    }

    
    private applyVariant(){
        if(this.config.variant === 'homePlay-btn'){this._button.innerHTML = this.getHomePlayButtonTemplate();}
        if(this.config.variant === 'setting-btn'){this._button.innerHTML = this.getButtonWithIconTemplate();}
        if(this.config.variant === 'exit-btn'){
            this._button.innerHTML = this.getButtonWithIconThemeTemplate();
            this._button.classList.add(`button--${this.config.variant}--${this.config.theme}`);
        }
    }

    private registerEvent():void {
        this._button.addEventListener('click', () => this.buttonClick())
    }

    enableButton(): void {
        this._button.classList.remove(`button--${this.config.variant}--disabled`);
    }



    private getHomePlayButtonTemplate(): string {
        return /* html */ `
            <div class='button--homePlay-btn__icon-left'></div>
            <span class='button--homePlay-btn__text'>${this.config.text}</span>
            <div class='button__icons--homePlay-btn'>
                <div class='button__icons--homePlay-btn__icon button__icons--homePlay-btn__icon--default'></div>
                <div class='button__icons--homePlay-btn__icon button__icons--homePlay-btn__icon--hover'></div>
            </div>
        `;
    }

    private getButtonWithIconTemplate(): string {
        return /* html */ `
            <div class='button__icons--${this.config.variant}'>
                <div class='
                    button__icons--${this.config.variant}__icon 
                    button__icons--${this.config.variant}__icon--default'></div>
                <div class='
                    button__icons--${this.config.variant}__icon 
                    button__icons--${this.config.variant}__icon--hover'></div>
            </div>
            <span class='button--${this.config.variant}__text'>${this.config.text}</span>
        `;
    }

    private getButtonWithIconThemeTemplate(): string {
        return /* html */ `
            <div class='button__icons--${this.config.variant}--${this.config.theme}'>
                <div class='
                    button__icons--${this.config.variant}--${this.config.theme}__icon
                    button__icons--${this.config.variant}--${this.config.theme}__icon--default'></div>
                <div class='
                    button__icons--${this.config.variant}--${this.config.theme}__icon 
                    button__icons--${this.config.variant}--${this.config.theme}__icon--hover'></div>
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
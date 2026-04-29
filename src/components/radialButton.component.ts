import '../styles/components/_radialButton.scss';
import { SettingButtonParamter } from '../types/game.types';

export class RadialButton {

    _buttonParams: SettingButtonParamter;
    _button: HTMLButtonElement;
    _isActive:boolean = false;

    constructor(buttonParams: SettingButtonParamter) {
        this._buttonParams = buttonParams;
        this._button = document.createElement('button');
        this.buildRadialHtmlButton();
        this.registerEventListener();
    }

    private buildRadialHtmlButton(): void {
        this._button.type = 'button';
        this._button.classList.add('radial-button');
        this._button.id = this._buttonParams.buttonId;
        this._button.setAttribute('data-button-id', this._buttonParams.buttonId);
        this._button.innerHTML = this.getButtonHtml();
    }

    private getButtonHtml(): string {
        const html: string = /* html */ `

            <div class='radial-button__circle'>
                <div class='radial-button__circle__inner'></div>
            </div>

            <span class='radial-button__text'>${this._buttonParams.buttonText}</span>

            <div class='radial-button__selection-indicator'>
                <div class='radial-button__selection-indicator__line'></div>
                <div class='radial-button__selection-indicator__diamond'></div>
            </div>

        `;

        return html;
    }

    private registerEventListener(): void {
        this._button.addEventListener('click', () => {
            if (this._buttonParams.onClicked) {
                this._buttonParams.onClicked(this._buttonParams.buttonId);
            }

            this.changeButtonActive();
        });
    }

    changeButtonActive(setInActive:boolean = false):void {

        if(setInActive) {
            this.toggleActive(false);
            return;
        }

        if(!this._isActive){
            this._isActive = true;
            this.toggleActive(true);
        }
        
    }

    private toggleActive(setActive:boolean):void {
        setActive 
        ? this._button.classList.add('radial-button--active') 
        : this._button.classList.remove('radial-button--active');
    }

    getRadialButton(): HTMLButtonElement {
        return this._button;
    }


}
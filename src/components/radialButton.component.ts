import '../styles/components/_radialButton.scss';
import { SettingButtonParamter } from '../types/game.types';

export class RadialButton {

    _buttonParams: SettingButtonParamter;
    private _button: HTMLButtonElement;
    private _isActive:boolean = false;

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
        if(this._buttonParams.isInitialActive){
            this.setActive(true);
        }
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
            this.setActive(true);
        });

        this._button.addEventListener('mouseenter', () => {
            if(this._buttonParams.onHovered){
                this._buttonParams.onHovered(this._buttonParams.buttonId);
            }
        });

        this._button.addEventListener('mouseleave', () => {
            if(this._buttonParams.onLeave){
                this._buttonParams.onLeave();
            }
        });;
    }


    get buttonId(): string {
        return this._buttonParams.buttonId;
    }

    setActive(isActive: boolean):void {

        this._isActive = isActive;
        this._button.classList.toggle('radial-button--active', isActive);
        
    }

    get radialButton(): HTMLButtonElement {
        return this._button;
    }


}
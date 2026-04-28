import '../styles/components/_radialButton.scss';
import { SettingButtonParamter } from '../types/game.types';

export class RadialButton {

    _buttonParams:SettingButtonParamter;

    constructor(buttonParams: SettingButtonParamter) {
        this._buttonParams = buttonParams;
    }

    private buildRadialHtmlButton(): HTMLButtonElement {
        const html: string = /* html */ `

            <!-- Kreis mit Punkt in der Mitte -->
                <div class='radial-button__circle'>
                    <span></span>
                </div>

                <span class='radial-button__text'>${this._buttonParams.buttonText}</span>

                <!-- Pfeil -->
                <div class='radial-button__selection-indicator'>
                    <div class='radial-button__selection-indicator__line'></div>
                    <div class='radial-button__selection-indicator__diamond'></div>
                </div>

        `;

        let buttonElemenet: HTMLButtonElement = document.createElement('button');
        buttonElemenet.type = 'button';
        buttonElemenet.classList.add('radial-button');
        buttonElemenet.id = this._buttonParams.buttonId;
        buttonElemenet.setAttribute('data-button-id', this._buttonParams.buttonId);
        buttonElemenet.innerHTML = html;



        return buttonElemenet;
    }

    private registerEventListener(button:HTMLButtonElement):void {
        button.addEventListener('click', () => {
            this.toggleIsActive();
        });
    }

    private toggleIsActive(){
        
        if (this._buttonParams.onClicked) {
            this._buttonParams.onClicked(this._buttonParams.buttonId);
        }
    }
    

    getRadialButton():HTMLButtonElement{
        const button = this.buildRadialHtmlButton();
        this.registerEventListener(button);
        return button;
    }


}
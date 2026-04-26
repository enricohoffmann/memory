import '../styles/components/_radialButton.scss';

export class RadialButton {

    constructor() {

    }


    private buildRadialButtonHtml(buttonText: string, buttonId: string): string {
        const html: string = /* html */ `

            <button type='button' class='radial-button' data-button-id='${buttonId}'>

                <!-- Kreis mit Punkt in der Mitte -->
                <div>
                    <span></span>
                </div>

                <span>${buttonText}</span>

                <!-- Pfeil -->
                <div></div>
            
            </button>

        `;

        return html;
    }

    getRadialButton(buttonText: string, buttonId: string):string{
        return this.buildRadialButtonHtml(buttonText, buttonId);
    }


}
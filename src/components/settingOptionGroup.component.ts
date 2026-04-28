import { SettingButtonParamter, SettingOption } from "../types/game.types";
import { RadialButton } from "./radialButton.component";

export class SettingOptionGroupComponent {
    constructor(private firstElementIsActive: boolean, private onOptionSelected: (optionId: string) => void) { }

    private optionGroupButtons:RadialButton[] = [];

    buildContainer<T extends SettingOption>(settingGroupArray: T[], nodeName: string): HTMLElement {
        const container: HTMLElement = document.createElement(nodeName);

        settingGroupArray.forEach((settingOption) => {
            const buttonParams = this.createButtonParameter(settingOption);
            const button: HTMLElement = this.createButton(buttonParams);
            container.appendChild(button);

        });
        return container;
    }

    private createButtonParameter<T extends SettingOption>(settingOption: T): SettingButtonParamter {
        return {
            buttonId: settingOption.id,
            buttonText: settingOption.name,
            isInitialActive: this.firstElementIsActive,
            onClicked: (settingOptionId:string ) => {
                this.onOptionSelected(settingOptionId)
                this.handleNewOptionSelected(settingOptionId);
            }
        };
    }

    private createButton(buttonParams: SettingButtonParamter): HTMLElement {
            const button: RadialButton = new RadialButton(buttonParams);
            this.optionGroupButtons.push(button);
            return button.getRadialButton();
        }

    private handleNewOptionSelected(optionId: string){
        console.log(optionId);
        
    }

}
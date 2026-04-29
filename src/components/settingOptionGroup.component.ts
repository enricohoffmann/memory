import { SettingButtonParamter, SettingOption } from "../types/game.types";
import { RadialButton } from "./radialButton.component";

export class SettingOptionGroupComponent {
    constructor(private firstElementIsActive: boolean, private onOptionSelected: (optionId: string) => void) { }

    private _optionGroupButtons:RadialButton[] = [];

    buildContainer<T extends SettingOption>(settingGroupArray: T[], nodeName: string): HTMLElement {
        const container: HTMLElement = document.createElement(nodeName);
        let arrIndex:number = 0;
        settingGroupArray.forEach((settingOption) => {
            const buttonParams = this.createButtonParameter(
                settingOption, this.firstElementIsActive && arrIndex == 0
            );
            const button: HTMLElement = this.createButton(buttonParams);
            container.appendChild(button);
            arrIndex++;
        });
        return container;
    }

    private createButtonParameter<T extends SettingOption>(settingOption: T, isInitialActive:boolean = false): SettingButtonParamter {
        return {
            buttonId: settingOption.id,
            buttonText: settingOption.name,
            isInitialActive: isInitialActive,
            onClicked: (settingOptionId:string ) => {
                this.onOptionSelected(settingOptionId)
                this.handleNewOptionSelected(settingOptionId);
            }
        };
    }

    private createButton(buttonParams: SettingButtonParamter): HTMLElement {
            const button: RadialButton = new RadialButton(buttonParams);
            this._optionGroupButtons.push(button);
            return button.getRadialButton();
        }

    private handleNewOptionSelected(optionId: string){

        this._optionGroupButtons.forEach((optionGroupButton)=>{
            const btnId = optionGroupButton._buttonParams.buttonId;
            if(btnId !== optionId){
                optionGroupButton.changeButtonActive(true);
            }
        });
        
    }

}
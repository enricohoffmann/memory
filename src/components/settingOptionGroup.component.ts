import { OptionGroup, SettingButtonParamter, SettingOption } from "../types/game.types";
import { RadialButton } from "./radialButton.component";

export class SettingOptionGroupComponent {
    constructor(private onOptionSelected: (optionId: string) => void) { }

    private _optionGroupButtons:RadialButton[] = [];

    buildContainer<T extends SettingOption>(settingGroupArray: T[], option: OptionGroup): HTMLElement {
        const container: HTMLElement = document.createElement(option.nodeName);
        const headerContainer: HTMLElement = this.buildOptionGroupHeader(option);
        container.appendChild(headerContainer);
        const optionGroup: HTMLElement = this.buildOptionsGroup(settingGroupArray, option);
        container.appendChild(optionGroup);

        return container;
    }

    private buildOptionGroupHeader(option: OptionGroup): HTMLElement {
        const optionHeader = document.createElement('header');
        optionHeader.classList.add('option-header')
        
        const optionIcon = document.createElement('img');
        optionIcon.classList.add('option-header__icon');
        optionIcon.src = option.iconPath;
        optionIcon.alt = 'Icon';

        const optionTitle = document.createElement('h3');
        optionTitle.classList.add('option-header__title');
        optionTitle.innerText = option.title;

        optionHeader.appendChild(optionIcon);
        optionHeader.appendChild(optionTitle);

        return optionHeader;

    }

    private buildOptionsGroup<T extends SettingOption>(groupArray: T[], option: OptionGroup): HTMLElement {
        const container: HTMLElement = document.createElement('main');
        container.classList.add('setting-group-main');

        let arrIndex:number = 0;
        groupArray.forEach((settingOption) => {
            const buttonParams = this.createButtonParameter(
                settingOption, option.firstElementIsActive && arrIndex == 0
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
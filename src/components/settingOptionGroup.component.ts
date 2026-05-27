import { BoardSize, OptionGroupSpecification, Player, SettingButtonParamter, SettingOption, Theme } from "../types/game.types";
import { RadialButton } from "./radialButton.component";

export class SettingOptionGroupComponent {
    constructor(
        private onOptionSelected: (optionId: string) => void, 
        private onOptionHovered?: (optionId: string) => void, 
        private onOptionLeave?: () => void ) { }

    private _optionGroupButtons:RadialButton[] = [];

    buildContainer(specification: OptionGroupSpecification<Theme | Player | BoardSize>): HTMLElement {
        const container: HTMLElement = document.createElement(specification.nodeName);
        const headerContainer: HTMLElement = this.buildOptionGroupHeader(specification);
        container.appendChild(headerContainer);
        const optionGroup: HTMLElement = this.buildOptionsGroup(specification.groupArray, specification);
        container.appendChild(optionGroup);

        return container;
    }


    changeSelectionFromExtern(id: string): void {
        this.handleNewOptionSelected(id);
    }

    private buildOptionGroupHeader(option: OptionGroupSpecification<Theme | Player | BoardSize>): HTMLElement {
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

    private buildOptionsGroup<T extends SettingOption>(groupArray: T[], option: OptionGroupSpecification<Theme | Player | BoardSize>): HTMLElement {
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
            },
            onHovered: (settingOptionId: string) => {
                this.handleOptionHover(settingOptionId)
            },
            onLeave: () => {
                this.handleOptionLeave();
            }
        };
    }

    private createButton(buttonParams: SettingButtonParamter): HTMLElement {
            const button: RadialButton = new RadialButton(buttonParams);
            this._optionGroupButtons.push(button);
            return button.radialButton;
        }

    private handleNewOptionSelected(optionId: string): void{

        this._optionGroupButtons.forEach((optionGroupButton)=>{
            const btnId = optionGroupButton._buttonParams.buttonId;
            optionGroupButton.setActive(btnId === optionId);
        });
        
    }

    private handleOptionHover(optionId: string): void {
        if(this.onOptionHovered){
            this.onOptionHovered(optionId);
        }   
    }

    private handleOptionLeave(): void {
        if(this.onOptionLeave){
            this.onOptionLeave();
        }
    }

}
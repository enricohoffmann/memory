import { BoardSize, OptionGroupSpecification, Player, SettingButtonParameter, SettingOption, Theme } from "../types/game.types";
import { RadialButton } from "./radial-button.component";

/**
 * Builds a labeled group of selectable radial buttons for the settings screen.
 *
 * The component renders the group header, creates one radial button per option,
 * and coordinates active-state updates together with the optional hover callbacks.
 */
export class SettingOptionGroupComponent {
  /**
   * Creates a new setting option group component instance.
   *
   * @param onOptionSelected Callback executed when an option is selected.
   * @param onOptionHovered Optional callback executed when an option is hovered.
   * @param onOptionLeave Optional callback executed when the pointer leaves an option.
   */
  constructor(
    private onOptionSelected: (optionId: string) => void, 
    private onOptionHovered?: (optionId: string) => void, 
    private onOptionLeave?: () => void ) { }

  private _optionGroupButtons:RadialButton[] = [];

  /**
   * Builds the full option group container including its header and selectable buttons.
   *
   * @param specification Describes the group structure, icon, title, and available options.
   * @returns The rendered option group container.
   */
  buildContainer(specification: OptionGroupSpecification<Theme | Player | BoardSize>): HTMLElement {
    const container: HTMLElement = document.createElement(specification.nodeName);
    const headerContainer: HTMLElement = this.buildOptionGroupHeader(specification);
    container.appendChild(headerContainer);
    const optionGroup: HTMLElement = this.buildOptionsGroup(specification.groupArray, specification);
    container.appendChild(optionGroup);

    return container;
  }


  /**
   * Updates the active button state from outside the component.
   *
   * @param id The id of the option that should be marked as selected.
   */
  changeSelectionFromExtern(id: string): void {
    this.handleNewOptionSelected(id);
  }

  /**
   * Builds the header section for an option group.
   *
   * @param option The option group specification containing the icon and title.
   * @returns The rendered header element.
   */
  private buildOptionGroupHeader(option: OptionGroupSpecification<Theme | Player | BoardSize>): HTMLElement {
    const optionHeader: HTMLElement = this.createOptionHeaderElement();
    const optionIcon: HTMLImageElement = this.createOptionHeaderIcon(option.iconPath);
    const optionTitle: HTMLElement = this.createOptionHeaderTitle(option.title);
    optionHeader.appendChild(optionIcon);
    optionHeader.appendChild(optionTitle);
    return optionHeader;
  }

  /**
   * Creates the root header element for an option group.
   *
   * @returns The created option header element.
   */
  private createOptionHeaderElement(): HTMLElement {
    const optionHeader: HTMLElement = document.createElement('header');
    optionHeader.classList.add('option-header');
    return optionHeader;
  }

  /**
   * Creates the icon element displayed in an option group header.
   *
   * @param iconPath The source path of the header icon.
   * @returns The created header icon element.
   */
  private createOptionHeaderIcon(iconPath: string): HTMLImageElement {
    const optionIcon: HTMLImageElement = document.createElement('img');
    optionIcon.classList.add('option-header__icon');
    optionIcon.src = iconPath;
    optionIcon.alt = 'Icon';
    return optionIcon;
  }

  /**
   * Creates the title element displayed in an option group header.
   *
   * @param title The title text of the option group.
   * @returns The created header title element.
   */
  private createOptionHeaderTitle(title: string): HTMLElement {
    const optionTitle: HTMLElement = document.createElement('h3');
    optionTitle.classList.add('option-header__title');
    optionTitle.innerText = title;
    return optionTitle;
  }

  /**
   * Builds the button container for all options in the group.
   *
   * @param groupArray The options that should be rendered as selectable buttons.
   * @param option The group specification that controls the rendering behavior.
   * @returns The rendered button group container.
   */
  private buildOptionsGroup<T extends SettingOption>(groupArray: T[], option: OptionGroupSpecification<Theme | Player | BoardSize>): HTMLElement {
    const container: HTMLElement = document.createElement('main');
    container.classList.add('setting-group-main');

    let arrIndex:number = 0;
    groupArray.forEach((settingOption) => {
      const buttonParams = this.createButtonParameter(
        settingOption, option.firstElementIsActive && arrIndex === 0
      );
      const button: HTMLElement = this.createButton(buttonParams);
      container.appendChild(button);
      arrIndex++;
    });
    return container;
  }

  /**
   * Creates the parameter object used to construct a radial button.
   *
   * @param settingOption The setting option represented by the button.
   * @param isInitialActive Determines whether the button should start in the active state.
   * @returns The radial button parameter object.
   */
  private createButtonParameter<T extends SettingOption>(
    settingOption: T,
    isInitialActive: boolean = false
  ): SettingButtonParameter {
    return {
      buttonId: settingOption.id,
      buttonText: settingOption.name,
      isInitialActive,
      onClicked: this.createOnClickedHandler(),
      onHovered: this.createOnHoveredHandler(),
      onLeave: this.createOnLeaveHandler()
    };
  }

  /**
   * Creates the click callback used by each radial button parameter object.
   *
   * @returns The click handler that updates external and internal selection state.
   */
  private createOnClickedHandler(): (settingOptionId: string) => void {
    return (settingOptionId: string): void => {
      this.onOptionSelected(settingOptionId);
      this.handleNewOptionSelected(settingOptionId);
    };
  }

  /**
   * Creates the hover callback used by each radial button parameter object.
   *
   * @returns The hover handler that forwards the hovered option id.
   */
  private createOnHoveredHandler(): (settingOptionId: string) => void {
    return (settingOptionId: string): void => {
      this.handleOptionHover(settingOptionId);
    };
  }

  /**
   * Creates the leave callback used by each radial button parameter object.
   *
   * @returns The leave handler that forwards the leave event.
   */
  private createOnLeaveHandler(): () => void {
    return (): void => {
      this.handleOptionLeave();
    };
  }

  /**
   * Creates a radial button instance and stores it for later active-state updates.
   *
   * @param buttonParams The configuration used to build the button.
   * @returns The rendered button element.
   */
  private createButton(buttonParams: SettingButtonParameter): HTMLElement {
      const button: RadialButton = new RadialButton(buttonParams);
      this._optionGroupButtons.push(button);
      return button.radialButton;
    }

  /**
   * Marks the selected option as active and deactivates all other buttons.
   *
   * @param optionId The id of the option that should become active.
   */
  private handleNewOptionSelected(optionId: string): void{

    this._optionGroupButtons.forEach((optionGroupButton)=>{
      const btnId = optionGroupButton._buttonParams.buttonId;
      optionGroupButton.setActive(btnId === optionId);
    });
    
  }

  /**
   * Forwards the hover event to the optional external callback.
   *
   * @param optionId The id of the currently hovered option.
   */
  private handleOptionHover(optionId: string): void {
    if(this.onOptionHovered){
      this.onOptionHovered(optionId);
    }   
  }

  /**
   * Forwards the leave event to the optional external callback.
   */
  private handleOptionLeave(): void {
    if(this.onOptionLeave){
      this.onOptionLeave();
    }
  }

}
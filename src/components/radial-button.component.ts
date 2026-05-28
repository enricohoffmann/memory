import '../styles/components/_radialButton.scss';
import { SettingButtonParameter } from '../types/game.types';

/**
 * Builds and manages an interactive radial selection button.
 *
 * The component renders the button markup, wires the optional interaction callbacks,
 * and tracks whether the button is currently marked as active.
 */
export class RadialButton {

  _buttonParams: SettingButtonParameter;
  private _button: HTMLButtonElement;
  private _isActive: boolean = false;

  /**
   * Creates a new radial button instance.
   *
   * @param buttonParams Defines the button id, label, initial state, and optional event callbacks.
   */
  constructor(buttonParams: SettingButtonParameter) {
    this._buttonParams = buttonParams;
    this._button = document.createElement('button');
    this.buildRadialHtmlButton();
    this.registerEventListeners();

  }

  /**
   * Configures the button element and applies the initial active state when required.
   */
  private buildRadialHtmlButton(): void {
    this._button.type = 'button';
    this._button.classList.add('radial-button');
    this._button.id = this._buttonParams.buttonId;
    this._button.setAttribute('data-button-id', this._buttonParams.buttonId);
    this._button.innerHTML = this.getButtonHtmlTemplate();
    if (this._buttonParams.isInitialActive) {
      this.setActive(true);
    }
  }

  /**
   * Creates the HTML structure for the radial button.
   *
   * @returns The HTML template string for the button.
   */
  private getButtonHtmlTemplate(): string {
    return /* html */ `
      <div class='radial-button__circle'>
        <div class='radial-button__circle__inner'></div>
      </div>

      <span class='radial-button__text'>${this._buttonParams.buttonText}</span>

      <div class='radial-button__selection-indicator'>
        <div class='radial-button__selection-indicator__line'></div>
        <div class='radial-button__selection-indicator__diamond'></div>
      </div>
    `;

  }

  /**
   * Registers the click and hover handlers for the button element.
   */
  private registerEventListeners(): void {
    this.registerOnClickEvent();
    this.registerHoverEvent();
    this.registerLeaveEvent();
  }

  /**
   * Handles the click event by invoking the optional external callback and marking the button as active.
   */
  private registerOnClickEvent(): void {
    this._button.addEventListener('click', () => {
      if (this._buttonParams.onClicked) {
        this._buttonParams.onClicked(this._buttonParams.buttonId);
      }
      this.setActive(true);
    });
  }

  /**
   * Handles the hover event by invoking the optional external callback.
   */
  private registerHoverEvent(): void {
    this._button.addEventListener('mouseenter', () => {
      if (this._buttonParams.onHovered) {
        this._buttonParams.onHovered(this._buttonParams.buttonId);
      }
    });
  }

  /**
   * Handles the leave event by invoking the optional external callback.
   */
  private registerLeaveEvent(): void {
    this._button.addEventListener('mouseleave', () => {
      if (this._buttonParams.onLeave) {
        this._buttonParams.onLeave();
      }
    });
  }

  /**
   * Returns the unique identifier of the radial button.
   */
  get buttonId(): string {
    return this._buttonParams.buttonId;
  }

  /**
   * Updates the active visual state of the button.
   *
   * @param isActive Determines whether the button should be marked as active.
   */
  setActive(isActive: boolean): void {

    this._isActive = isActive;
    this._button.classList.toggle('radial-button--active', isActive);

  }

  /**
   * Returns the rendered button element.
   */
  get radialButton(): HTMLButtonElement {
    return this._button;
  }


}
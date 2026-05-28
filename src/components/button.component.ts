import { ButtonConfig, ButtonVariant, ThemeKey } from "../types/game.types";
import '../styles/components/_button.scss';


/**
 * Builds and manages a styled button element based on the provided button configuration.
 *
 * The component is responsible for creating the DOM node, applying the matching visual
 * variant, registering the click handler, and exposing the final button element for rendering.
 */
export class ButtonComponent {

  private _button: HTMLButtonElement;

  /**
   * Creates a new button component instance.
   *
   * @param config Defines the button variant, theme, label, icon usage, and disabled state.
   * @param buttonClick Callback that is executed when the button is clicked.
   */
  constructor(private config: ButtonConfig, private buttonClick: () => void){
    this._button = document.createElement('button');
    this._button.type = 'button';
    this._button.classList.add('button', `button--${config.variant}`);
  }

  /**
   * Applies the configured variant, registers the click handler, and returns the button element.
   *
   * @returns The fully configured HTML button element.
   */
  renderButton(): HTMLButtonElement {
    this.applyVariant();
    this.registerEvent();
    if(this.config.disabled === true){this._button.classList.add(`button--${this.config.variant}--disabled`);}
    return this._button;
  }

  
  /**
   * Injects the markup and theme-specific classes required for the configured button variant.
   */
  private applyVariant(): void {
    if(this.config.variant === 'homePlay-btn'){this._button.innerHTML = this.getHomePlayButtonTemplate();}
    if(this.config.variant === 'setting-btn'){this._button.innerHTML = this.getButtonWithIconTemplate();}
    if(this.config.variant === 'exit-btn' || this.config.variant === 'win-draw-btn'){
      this._button.innerHTML = this.getButtonWithIconThemeTemplate();
      this._button.classList.add(`button--${this.config.variant}--${this.config.theme}`);
    }
    if(this.config.variant === 'popup-resume' || this.config.variant === 'popup-exit'){
      this._button.classList.add(`button--${this.config.variant}--${this.config.theme}`);
      this._button.innerHTML = this.getButtonTemplate();
    }
  }

  /**
   * Binds the configured click callback to the button element.
   */
  private registerEvent():void {
    this._button.addEventListener('click', () => this.buttonClick())
  }

  /**
   * Removes the disabled modifier class from the button.
   */
  enableButton(): void {
    this._button.classList.remove(`button--${this.config.variant}--disabled`);
  }



  /**
   * Creates the markup for the home play button variant.
   *
   * @returns The HTML template string for the home play button.
   */
  private getHomePlayButtonTemplate(): string {
    return /* html */ `
      <div class='button--homePlay-btn__icon-left'></div>
      <span class='button--homePlay-btn__text'>${this.config.text}</span>
      <div class='button--homePlay-btn__icons'>
        <div class='button--homePlay-btn__icons__icon button--homePlay-btn__icons__icon--default'></div>
        <div class='button--homePlay-btn__icons__icon button--homePlay-btn__icons__icon--hover'></div>
      </div>
    `;
  }

  /**
   * Creates the markup for button variants that show an icon group next to the label.
   *
   * @returns The HTML template string for an icon-based button.
   */
  private getButtonWithIconTemplate(): string {
    return /* html */ `
      <div class='button--${this.config.variant}__icons'>
        <div class='
          button--${this.config.variant}__icons__icon 
          button--${this.config.variant}__icons__icon--default'></div>
        <div class='
          button--${this.config.variant}__icons__icon 
          button--${this.config.variant}__icons__icon--hover'></div>
      </div>
      <span class='button--${this.config.variant}__text'>${this.config.text}</span>
    `;
  }

  /**
   * Creates the markup for themed button variants that can optionally render an icon.
   *
   * @returns The HTML template string for a themed button.
   */
  private getButtonWithIconThemeTemplate(): string {
    return /* html */ `

      ${this.config.hasIcon ? `<div class='button--${this.config.variant}__icons'>
        <div class='
          button--${this.config.variant}__icons__icon
          button--${this.config.variant}--${this.config.theme}--default'></div>
        <div class='
          button--${this.config.variant}__icons__icon
          button--${this.config.variant}--${this.config.theme}--hover'></div>
      </div>` : ''}
      
      <span class='button--${this.config.variant}--${this.config.theme}__text'>${this.config.text}</span>
    `;
  }


  /**
   * Creates the markup for simple text-only popup button variants.
   *
   * @returns The HTML template string for a popup button.
   */
  private getButtonTemplate(): string {
    return /*html*/ `
      <span class='button--${this.config.variant}--${this.config.theme}__text'>${this.config.text}</span>
    `;
  }

}
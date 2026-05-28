import '../styles/components/_dialog.scss';
import { ButtonConfig, ButtonVariant, DialogButtonMessages, ThemeKey } from '../types/game.types';
import { ButtonComponent } from './button.component';


/**
 * Builds and controls the confirmation dialog that is shown when the player wants to leave the game.
 *
 * The component renders theme-specific dialog content, creates the action buttons,
 * and manages the dialog visibility and click interactions.
 */
export class DialogComponent {

  private _dialogElement: HTMLElement;
  private readonly _buttonMessagesByTheme: Record<ThemeKey, DialogButtonMessages> = {
    'code-vibes': { theme: 'code-vibes', resumeText: 'Back to game', exitText: 'Exit game' },
    'games': { theme: 'games', resumeText: 'No, back to game', exitText: 'Yes, quit game' },
    'da-projects': { theme: 'da-projects', resumeText: 'Back to game', exitText: 'Exit game' },
    'food': { theme: 'food', resumeText: 'No, back to game', exitText: 'Exit game' }
  };

  /**
   * Creates a new dialog component instance.
   *
   * @param theme The active theme used to style the dialog and its buttons.
   * @param exitGame Callback executed when the user confirms leaving the game.
   * @param resumeGame Callback executed when the user dismisses the dialog and continues the game.
   */
  constructor(
    private theme: ThemeKey,
    private exitGame: () => void,
    private resumeGame: () => void
  ) {
    this._dialogElement = document.createElement('section');
  }

  /**
   * Builds the dialog markup and appends the theme-specific action buttons.
   *
   * @returns The rendered dialog root element.
   */
  renderDialog(): HTMLElement {
    this.buildDialog();
    const resumeBtnConfig = this.createButtonConfig('popup-resume');
    this.buildResumeButton(resumeBtnConfig);
    const exitBtnConfig = this.createButtonConfig('popup-exit');
    this.buildExitButton(exitBtnConfig);
    return this._dialogElement;
  }

  /**
   * Makes the dialog visible and registers its click handlers.
   */
  showDialog(): void {
    this._dialogElement.classList.add('dialog-section--show');
    this.registerDialogClickEvent();
    this.registerDialogContainerClickEvent();
  }

  /**
   * Hides the dialog and resolves after the closing animation has finished.
   *
   * @returns A promise that resolves to `true` after the dialog has been hidden.
   */
  async hideDialog(): Promise<boolean> {

    return new Promise((resolve) => {

      this._dialogElement.classList.remove('dialog-section--show');

      setTimeout(() => {
        resolve(true);
      }, 500);

    });
  }

  /**
   * Creates the button configuration for a dialog action based on the active theme.
   *
   * @param btnVariant The dialog button variant to configure.
   * @returns A button configuration object for the active dialog theme.
   */
  private createButtonConfig(btnVariant: ButtonVariant): ButtonConfig {
    const btnMsg: DialogButtonMessages = this._buttonMessagesByTheme[this.theme];
    const config: ButtonConfig = {
      variant: btnVariant,
      theme: this.theme,
      text: btnVariant === 'popup-resume' ? btnMsg.resumeText : btnMsg.exitText
    };
    return config;
  }

  /**
   * Builds the dialog shell and its static content.
   */
  private buildDialog(): void {
    this._dialogElement.classList.add('dialog-section');
    this._dialogElement.innerHTML = this.dialogHtmlTemplate();
  }

  /**
   * Generates the HTML template for the dialog based on the active theme.
   * @returns The HTML string for the dialog.
   */
  private dialogHtmlTemplate(): string {
    return /* html */ `
      <div class='dialog-container dialog-container--${this.theme}'>
        <h2 class='dialog-headline dialog-headline--${this.theme}'>Are you sure you want to quit the game?</h2>
        <aside id='dialog-buttons' class='dialog-buttons'>
        </aside>
      </div>
    `;
  }

  /**
   * Registers the click handler that closes the dialog when the backdrop is clicked.
   */
  private registerDialogClickEvent(): void {
    this._dialogElement.addEventListener('click', () => this.resumeGame());
  }

  /**
   * Prevents clicks inside the dialog container from bubbling to the backdrop handler.
   */
  private registerDialogContainerClickEvent(): void {
    const dialogContainer: HTMLElement = this._dialogElement.querySelector('.dialog-container') as HTMLElement;
    if (!dialogContainer) { return; }
    dialogContainer.addEventListener('click', (event) => event.stopPropagation());
  }

  /**
   * Creates and appends the resume button to the dialog.
   *
   * @param btnConfig The configuration used to build the resume button.
   */
  private buildResumeButton(btnConfig: ButtonConfig): void {
    const button: ButtonComponent = new ButtonComponent(btnConfig, () => this.resumeGame());
    const buttonContainer: HTMLElement = this._dialogElement.querySelector('#dialog-buttons') as HTMLElement;
    if (buttonContainer) {
      buttonContainer.appendChild(button.renderButton());
    }
  }

  /**
   * Creates and appends the exit button to the dialog.
   *
   * @param btnConfig The configuration used to build the exit button.
   */
  private buildExitButton(btnConfig: ButtonConfig): void {
    const button: ButtonComponent = new ButtonComponent(btnConfig, () => this.exitGame());
    const buttonContainer: HTMLElement = this._dialogElement.querySelector('#dialog-buttons') as HTMLElement;
    if (buttonContainer) {
      buttonContainer.appendChild(button.renderButton());
    }
  }



}
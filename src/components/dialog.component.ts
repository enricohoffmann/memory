import '../styles/components/_dialog.scss';
import { ButtonConfig, ButtonVariant, DialogButtonMessages, ThemeKey } from '../types/game.types';
import { ButtonComponent } from './button.component';


export class DialogComponent {

    private _dialogElement: HTMLElement;
    private _buttonMessages: DialogButtonMessages[] = [];

    constructor(
        private theme: ThemeKey,
        private exitGame: () => void,
        private resumeGame: () => void
    ) {
        this._dialogElement = document.createElement('section');
        this.createButtonMessages();
    }

    renderDialog(): HTMLElement {
        this.buildDialog();
        this.createButtonMessages();
        const resumeBtnConfig = this.createButtonConfig('popup-resume');
        if(resumeBtnConfig === null) {return this._dialogElement;}
        this.buildResumeButton(resumeBtnConfig);
        const exitBtnConfig = this.createButtonConfig('popup-exit');
        if(exitBtnConfig === null) {return this._dialogElement;}
        this.buildExitButton(exitBtnConfig);
        return this._dialogElement;
    }

    showDialog(): void {
        this._dialogElement.classList.add('dialog-section--show');
        this.registerDialogClickEvent();
        this.registerDialogContainerClickEvent();
    }

    async hideDialog(): Promise<boolean> {

        return new Promise((resolve) => {

            this._dialogElement.classList.remove('dialog-section--show');

            setTimeout(() => {
                resolve(true);
            }, 500);
            
        });
    }

    private createButtonMessages(): void {
        const codeVibeMsg: DialogButtonMessages = {theme: 'code-vibes', resumeText: 'Back to game', exitText: 'Exit game'};
        this._buttonMessages.push(codeVibeMsg);
        const gameMsg: DialogButtonMessages = {theme: 'games', resumeText: 'No, back to game', exitText: 'Yes, quit game'};
        this._buttonMessages.push(gameMsg);
        const daProjectMsg: DialogButtonMessages = {theme: 'da-projects', resumeText: 'Back to game', exitText: 'Exit game'};
        this._buttonMessages.push(daProjectMsg);
        const foodMsg: DialogButtonMessages = {theme: 'food', resumeText: 'No, back to game', exitText: 'Exit game'};
        this._buttonMessages.push(foodMsg);
    }

    private createButtonConfig(btnVariant: ButtonVariant): ButtonConfig | null {
        const btnMsg: DialogButtonMessages | null | undefined = this._buttonMessages.find(m => m.theme === this.theme);
        if(btnMsg === null || btnMsg === undefined) {return null;}
        const config: ButtonConfig = {
            variant: btnVariant,
            theme: this.theme,
            text: btnVariant === 'popup-resume' ? btnMsg.resumeText : btnMsg.exitText
        }
        return config;
    }

    private buildDialog() {
        this._dialogElement.classList.add('dialog-section');
        this._dialogElement.innerHTML = /*html*/ `
            <div class='dialog-container dialog-container--${this.theme}'>
                <h2 class='dialog-headline dialog-headline--${this.theme}'>Are you sure you want to quit the game?</h2>
                <aside id='dialog-buttons' class='dialog-buttons'>
                </aside>
            </div>
        `;
    }

    private registerDialogClickEvent(): void {
        this._dialogElement.addEventListener('click', () => this.resumeGame());
    }

    private registerDialogContainerClickEvent():void {
        const dialogContainer: HTMLElement = this._dialogElement.querySelector('.dialog-container') as HTMLElement;
        if(!dialogContainer){return;}
        dialogContainer.addEventListener('click', (event) => event.stopPropagation());
    }

    private buildResumeButton(btnConfig: ButtonConfig) {
        const button: ButtonComponent = new ButtonComponent(btnConfig, () => this.resumeGame());
        const buttonContainer:HTMLElement = this._dialogElement.querySelector('#dialog-buttons') as HTMLElement;
        if(buttonContainer){
            buttonContainer.appendChild(button.renderButton());
        }
    }

    private buildExitButton(btnConfig: ButtonConfig) {
        const button: ButtonComponent = new ButtonComponent(btnConfig, () => this.exitGame());
        const buttonContainer:HTMLElement = this._dialogElement.querySelector('#dialog-buttons') as HTMLElement;
        if(buttonContainer){
            buttonContainer.appendChild(button.renderButton());
        }
    }



}
import '../styles/components/_dialog.scss';
import { ThemeKey } from '../types/game.types';
import { ButtonComponent } from './button.component';


export class DialogComponent {

    private _dialogElement: HTMLElement;

    constructor(
        private theme: ThemeKey,
        private exitGame: () => void,
        private resumeGame: () => void
    ) {
        this._dialogElement = document.createElement('section');
    }



    renderDialog(): HTMLElement {
        this.buildDialog();
        this.buildResumeButton();
        this.buildExitButton();
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

    private buildResumeButton() {
        const button: ButtonComponent = new ButtonComponent('exit-btn', () => this.resumeGame());
        const buttonElement = button.getWinDrawBackButton(this.theme, 'Back to game');
        const buttonContainer:HTMLElement = this._dialogElement.querySelector('#dialog-buttons') as HTMLElement;
        if(buttonContainer){
            buttonContainer.appendChild(buttonElement);
        }
    }

    private buildExitButton() {
        const button: ButtonComponent = new ButtonComponent('exit-btn', () => this.exitGame());
        const buttonElement = button.getWinDrawBackButton(this.theme, 'Exit game');
        const buttonContainer:HTMLElement = this._dialogElement.querySelector('#dialog-buttons') as HTMLElement;
        if(buttonContainer){
            buttonContainer.appendChild(buttonElement);
        }
    }



}
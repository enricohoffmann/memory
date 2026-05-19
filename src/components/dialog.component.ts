import '../styles/components/_dialog.scss';
import { ThemeKey } from '../types/game.types';


export class DialogComponent {

    private _dialogElement: HTMLElement;

    constructor(
        private theme: ThemeKey, 
        private exitGame: () => void,
        private resumeGame: () => void
    ){
        this._dialogElement = document.createElement('section');
    }

    

    renderDialog():HTMLElement{
        this.buildDialog();
        return this._dialogElement;
    }

    showDialog():void {
        this._dialogElement.classList.add('dialog-section--show');
    }

    private buildDialog(){
        this._dialogElement.classList.add('dialog-section');
        this._dialogElement.innerHTML = /*html*/ `
            <div class='dialog-container dialog-container--${this.theme}'>
                <h2 class='dialog-headline dialog-headline--${this.theme}'>Are you sure you want to quit the game?</h2>
                <aside id='dialog-buttons' class='dialog-buttons'>
                </aside>
            </div>
        `;
    }

    private buildResumeButton(){

    }

    private buildExitButton(){

    }



}
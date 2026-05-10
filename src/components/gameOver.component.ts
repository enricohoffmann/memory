import { ThemeKey, Player } from "../types/game.types";
import { PlayerScoreBordComponent } from "./playerScoreBoard.component";

import '../styles/components/_gameOverComponent.scss';

export class GameOverComponent {

    private _gameOverElement: HTMLElement;

    constructor(private theme: ThemeKey){
        this._gameOverElement = document.createElement('section');
        this._gameOverElement.classList.add('game-over-screen', `game-over-screen--${theme}`);
    }

    buildGameOverElement(players: Player[]): HTMLElement {
        this._gameOverElement.appendChild(this.createHeadline());
        this._gameOverElement.appendChild(this.createTextLine());
        this._gameOverElement.appendChild(this.buildScoreBoard(players));
        return this._gameOverElement;
    }

    private createHeadline(): HTMLElement {
        const headLine = document.createElement('h1');
        headLine.classList.add(`game-over-screen--${this.theme}__headline`);
        headLine.innerText = "Game over";
        return headLine;
    }

    private createTextLine(): HTMLElement {
        const textLine = document.createElement('p');
        textLine.classList.add(`game-over-screen--${this.theme}__textline`);
        textLine.innerText = 'Final score';
        return textLine;
    }

    private buildScoreBoard(players: Player[]): HTMLElement {
        const scoreBoard:PlayerScoreBordComponent = new PlayerScoreBordComponent(this.theme, 'game-over');
        const scoreBoardElement: HTMLElement = scoreBoard.render();
        scoreBoard.showScoreForPlayers(players);
        return scoreBoardElement;
    }


}
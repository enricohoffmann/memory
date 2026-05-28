import { ThemeKey, Player } from "../types/game.types";
import { PlayerScoreBoardComponent } from "./playerScoreBoard.component";

import '../styles/components/_gameOverComponent.scss';

/**
 * Builds the game over screen that shows the final player scores.
 *
 * The component renders a themed headline, a supporting text line, and the
 * scoreboard for the completed match.
 */
export class GameOverComponent {

    private _gameOverElement: HTMLElement;

    /**
     * Creates a new game over component instance.
     *
     * @param theme The active theme used to style the game over screen.
     */
    constructor(private theme: ThemeKey){
        this._gameOverElement = document.createElement('section');
        this._gameOverElement.classList.add('game-over-screen', `game-over-screen--${theme}`);
    }

    /**
     * Builds the complete game over view including the final scoreboard.
     *
     * @param players The players whose final scores should be displayed.
     * @returns The rendered game over root element.
     */
    buildGameOverElement(players: Player[]): HTMLElement {
        this._gameOverElement.appendChild(this.createHeadline());
        this._gameOverElement.appendChild(this.createTextLine());
        this._gameOverElement.appendChild(this.buildScoreBoard(players));
        return this._gameOverElement;
    }

    /**
     * Creates the main headline of the game over screen.
     *
     * @returns The generated headline element.
     */
    private createHeadline(): HTMLElement {
        const headLine = document.createElement('h1');
        headLine.classList.add(`game-over-screen--${this.theme}__headline`);
        headLine.innerText = "Game over";
        return headLine;
    }

    /**
     * Creates the supporting text line above the final scoreboard.
     *
     * @returns The generated text line element.
     */
    private createTextLine(): HTMLElement {
        const textLine = document.createElement('p');
        textLine.classList.add(`game-over-screen--${this.theme}__textline`);
        textLine.innerText = 'Final score';
        return textLine;
    }

    /**
     * Builds the scoreboard component for the provided players.
     *
     * @param players The players whose scores should be rendered.
     * @returns The rendered scoreboard element.
     */
    private buildScoreBoard(players: Player[]): HTMLElement {
        const scoreBoard: PlayerScoreBoardComponent = new PlayerScoreBoardComponent(this.theme, 'game-over');
        const scoreBoardElement: HTMLElement = scoreBoard.render();
        scoreBoard.showScoreForPlayers(players);
        return scoreBoardElement;
    }


}
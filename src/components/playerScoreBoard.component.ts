import { Player, ThemeKey } from "../types/game.types";
import '../styles/components/_playerScoreBoard.scss';

export class PlayerScoreBordComponent {

    private _scoreBoard: HTMLElement;


    constructor(private theme: ThemeKey){
        this._scoreBoard = document.createElement('section');
        this._scoreBoard.classList.add('score-board', `score-board--${this.theme}`);
    }

    render(): HTMLElement {
       this._scoreBoard.innerHTML = /* html */ `
        
        <div class="score-board__icon score-board__icon--one" alt='Player one icon'></div>
        <span class='score-board__player-text score-board__player-text--one'>Blue</span>
        <span class='score-board__player-score score-board__player-score--one' id='player-01-score'>0</span>
        <div class='score-board__icon score-board__icon--two' alt='Player two icon'></div>
        <span class='score-board__player-text score-board__player-text--two'>Orange</span>
        <span class='score-board__player-score score-board__player-score--two' id='player-02-score'>0</span>
       
       `;

       return this._scoreBoard;
    }

    showScoreForPlayers(players: Player[]):void {
        players.forEach((player) => {
            const element: HTMLElement | null = this._scoreBoard.querySelector(`#${player.id}-score`);
            if (element) {
                element.innerText = String(player.score);
            }
        });
    }
    
}
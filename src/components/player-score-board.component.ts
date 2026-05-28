import { Player, ScoreBoardVariant, ThemeKey } from "../types/game.types";
import '../styles/components/_playerScoreBoard.scss';

/**
 * Builds and updates the scoreboard for the active players.
 *
 * The component renders a themed scoreboard layout and provides a method to write
 * the current scores of the supplied players into the matching DOM elements.
 */
export class PlayerScoreBoardComponent {

  private _scoreBoard: HTMLElement;


  /**
   * Creates a new player scoreboard component instance.
   *
   * @param theme The active theme used to style the scoreboard.
   * @param scoreBoardVariant Determines whether the scoreboard is rendered for play or game-over mode.
   */
  constructor(private theme: ThemeKey, private scoreBoardVariant: ScoreBoardVariant) {
    this._scoreBoard = document.createElement('section');
    this._scoreBoard.classList.add('score-board', `score-board--${this.theme}`, `score-board--${this.theme}-${scoreBoardVariant}`);
  }

  /**
   * Renders the scoreboard markup with player labels, icons, and initial scores.
   *
   * @returns The rendered scoreboard root element.
   */
  render(): HTMLElement {
    this._scoreBoard.innerHTML = this.scoreBoardHtmlTemplate();
    return this._scoreBoard;
  }

  /**
   * Generates the HTML template for the scoreboard based on the active theme and variant.
   * @returns The HTML string for the scoreboard.
   */
  private scoreBoardHtmlTemplate(): string {
    return /* html */ `
      <div class="score-board__icon score-board__icon--one"></div>
      <span class='score-board__player-text score-board__player-text--one'>Blue</span>
      <span class='score-board__player-score score-board__player-score--one' id='player-01-score'>0</span>
      <div class='score-board__icon score-board__icon--two'></div>
      <span class='score-board__player-text score-board__player-text--two'>Orange</span>
      <span class='score-board__player-score score-board__player-score--two' id='player-02-score'>0</span>
    `;
  }

  /**
   * Updates the displayed scores for the provided players.
   *
   * @param players The players whose current scores should be shown on the scoreboard.
   */
  showScoreForPlayers(players: Player[]): void {
    players.forEach((player) => {
      const element: HTMLElement | null = this._scoreBoard.querySelector(`#${player.id}-score`);
      if (element) {
        element.innerText = String(player.score);
      }
    });
  }

}
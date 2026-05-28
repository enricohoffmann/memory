import { ButtonConfig, GameOverResult, ThemeKey, TrophyType } from "../types/game.types";
import { ButtonComponent } from "./button.component";
import '../styles/components/_endScreenComponent.scss';

/**
 * Builds the final game screen that displays the winner or a draw result.
 *
 * The component renders theme-specific result content, trophy visuals, and a button
 * that returns the user to the home screen.
 */
export class EndScreenComponent {

  private _endScreenElement: HTMLElement;

  /**
   * Creates a new end screen component instance.
   *
   * @param theme The active theme used to style the end screen.
   * @param gameEndResult The final game result containing the status and winning player.
   * @param backToHome Callback executed when the user wants to return to the home screen.
   */
  constructor(private theme: ThemeKey, 
    private gameEndResult: GameOverResult, 
    private backToHome: () => void){
    this._endScreenElement = document.createElement('section');
    this._endScreenElement.classList.add('end-screen-section', `end-screen-section--${theme}`);
  }


  /**
   * Renders the end screen content for either a win or a draw.
   *
   * @returns The fully rendered end screen root element.
   */
  render(): HTMLElement {
    if(this.gameEndResult.gameStatus === 'draw') {this.composeDraw();}
    if(this.gameEndResult.gameStatus === 'won'){
      if(this.theme === 'code-vibes'){
        this.composeCodeVibeWinner();
      }else {
        this.composeWinner();
      }
    }
    return this._endScreenElement;
  }


  /**
   * Composes the winner layout for the `code-vibes` theme.
   */
  private composeCodeVibeWinner(): void{
    
    //top
    const codeVibeHeader: HTMLElement = document.createElement('header');
    codeVibeHeader.classList.add('code-vibes-header');
    codeVibeHeader.appendChild(this.buildTopElement());

    this._endScreenElement.appendChild(codeVibeHeader);
    this._endScreenElement.appendChild(this.buildResultMessageElement('winner'));
    this._endScreenElement.appendChild(this.buildWinnerMessageElement());
    this._endScreenElement.appendChild(this.buildTrophyElement('winner'));
    this._endScreenElement.appendChild(this.buildBackButtonElement());

  }

  /**
   * Composes the default winner layout for all non-`code-vibes` themes.
   */
  private composeWinner(): void {
    this._endScreenElement.appendChild(this.buildResultMessageElement('winner'));
    this._endScreenElement.appendChild(this.buildWinnerMessageElement());
    this._endScreenElement.appendChild(this.buildTrophyElement('winner'));
    this._endScreenElement.appendChild(this.buildBackButtonElement());
  }

  /**
   * Composes the draw layout.
   */
  private composeDraw(): void {
    this._endScreenElement.appendChild(this.buildResultMessageElement('draw'));
    this._endScreenElement.appendChild(this.buildDrawMessageElement());
    this._endScreenElement.appendChild(this.buildTrophyElement('draw'));
    this._endScreenElement.appendChild(this.buildBackButtonElement());
  }


  /**
   * Builds the decorative top element used by the `code-vibes` end screen.
   *
   * @returns The generated top decoration element.
   */
  private buildTopElement(): HTMLElement {
    const topElement = this.createHtmlElement('div', [`${this.theme}--top`]);
    return topElement;
  }

  /**
   * Builds the message that introduces the game result.
   *
   * @param trophyType Determines whether the message describes a winner or a draw.
   * @returns The generated result message element.
   */
  private buildResultMessageElement(trophyType: TrophyType): HTMLElement {
    const resultMessage = this.createHtmlElement('p', ['result-message', `result-message--${this.theme}`]);
    if(this.theme === 'code-vibes' && this.gameEndResult.gameStatus === 'won'){
      resultMessage.classList.add('result-message-mt');
    }
    resultMessage.innerText = trophyType === 'winner' ? 'The winner is' : 'It´s a';
    return resultMessage;
  }

  /**
   * Builds the headline element for a draw result.
   *
   * @returns The generated draw headline element.
   */
  private buildDrawMessageElement(): HTMLElement {
    const drawElement = this.createHtmlElement('h1', ['draw-headline', `draw-headline--${this.theme}`]);
    drawElement.innerText = 'DRAW';
    return drawElement;
  }


  /**
   * Builds the headline element that displays the winning player.
   *
   * @returns The generated winner headline element.
   */
  private buildWinnerMessageElement(): HTMLElement {
    const winnerMessage = this.createHtmlElement('h1', ['winner-headline', `winner-headline--${this.theme}`, `winner-headline--${this.theme}--winner-${this.gameEndResult.winner.color}`]);
    let playerMessage = `${this.gameEndResult.winner.name} Player`;
    winnerMessage.innerText = this.theme === 'code-vibes' ? playerMessage.toUpperCase() : playerMessage;
    return winnerMessage;
  }

  /**
   * Builds the trophy element for either a winner or a draw result.
   *
   * @param trophyType Determines which trophy styling should be applied.
   * @returns The generated trophy element, including the food-theme wrapper when required.
   */
  private buildTrophyElement(trophyType: TrophyType): HTMLElement {
    let classList: string[] = [];
    classList.push('trophy', `trophy--${this.theme}`);

    trophyType === 'draw' ? classList.push(
      `trophy--${this.theme}--draw`) 
      : classList.push(`trophy--${this.theme}--winner-${this.gameEndResult.winner.color}`);
      
    const trophyBackground = this.createHtmlElement('div', ['food-end-trophy-bg', `food-end-trophy-bg--${this.gameEndResult.gameStatus}`]);
    const trophyElement = this.createHtmlElement('div', classList);

    if(this.theme === 'food'){
      trophyBackground.appendChild(trophyElement);
    }

    return this.theme === 'food' ? trophyBackground : trophyElement;
  }

  /**
   * Builds the button that navigates the user back to the home screen.
   *
   * @returns The rendered back button element.
   */
  private buildBackButtonElement(): HTMLElement {

    const btnConfig: ButtonConfig = {variant: 'win-draw-btn', theme: this.theme, text: this.theme === 'code-vibes' ? 'Back to start' : 'Home', hasIcon: false};
    const button: ButtonComponent = new ButtonComponent(btnConfig, () => this.backToHome());
    return button.renderButton();
  }

  /**
   * Creates an HTML element and applies the provided CSS classes.
   *
   * @param nodeType The HTML tag name to create.
   * @param classNames The CSS classes that should be applied to the element.
   * @returns The generated HTML element.
   */
  private createHtmlElement(nodeType: string, classNames: string[]): HTMLElement {
    const element = document.createElement(nodeType);
    classNames.forEach((className) => {
      element.classList.add(className);
    });

    return element;

  }

}
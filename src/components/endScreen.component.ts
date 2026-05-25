import { ButtonConfig, GameOverResult, ThemeKey, TrophyType } from "../types/game.types";
import { ButtonComponent } from "./button.component";
import '../styles/components/_endScreenComponent.scss';

export class EndScreenComponent {

    private _endScreenElement: HTMLElement;

    constructor(private theme: ThemeKey, 
        private gameEndResult: GameOverResult, 
        private backToHome: () => void){
        this._endScreenElement = document.createElement('section');
        this._endScreenElement.classList.add('end-screen-section', `end-screen-section--${theme}`);
    }


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

    private composeWinner(): void {
        this._endScreenElement.appendChild(this.buildResultMessageElement('winner'));
        this._endScreenElement.appendChild(this.buildWinnerMessageElement());
        this._endScreenElement.appendChild(this.buildTrophyElement('winner'));
        this._endScreenElement.appendChild(this.buildBackButtonElement());
    }

    private composeDraw(): void {
        this._endScreenElement.appendChild(this.buildResultMessageElement('draw'));
        this._endScreenElement.appendChild(this.buildDrawMessageElement());
        this._endScreenElement.appendChild(this.buildTrophyElement('draw'));
        this._endScreenElement.appendChild(this.buildBackButtonElement());
    }


    private buildTopElement(): HTMLElement {
        const topElement = this.createHtmlElement('div', [`${this.theme}--top`]);
        return topElement;
    }

    private buildResultMessageElement(trophyType: TrophyType): HTMLElement {
        const resultMessage = this.createHtmlElement('p', ['result-message', `result-message--${this.theme}`]);
        if(this.theme === 'code-vibes' && this.gameEndResult.gameStatus === 'won'){
            resultMessage.classList.add('result-message-mt');
        }
        resultMessage.innerText = trophyType === 'winner' ? 'The winner is' : 'It´s a';
        return resultMessage;
    }

    private buildDrawMessageElement(): HTMLElement {
        const drawElement = this.createHtmlElement('h1', ['draw-headline', `draw-headline--${this.theme}`]);
        drawElement.innerText = 'DRAW';
        return drawElement;
    }


    private buildWinnerMessageElement(): HTMLElement {
        const winnerMessage = this.createHtmlElement('h1', ['winner-headline', `winner-headline--${this.theme}`, `winner-headline--${this.theme}--winner-${this.gameEndResult.winner.color}`]);
        let playerMessage = `${this.gameEndResult.winner.name} Player`;
        winnerMessage.innerText = this.theme === 'code-vibes' ? playerMessage.toUpperCase() : playerMessage;
        return winnerMessage;
    }

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

    private buildBackButtonElement(): HTMLElement {

        const btnConfig: ButtonConfig = {variant: 'win-draw-btn', theme: this.theme, text: this.theme === 'code-vibes' ? 'Back to start' : 'Home', hasIcon: false};
        const button: ButtonComponent = new ButtonComponent(btnConfig, () => this.backToHome());
        return button.renderButton();
    }

    private createHtmlElement(nodeType: string, classNames: string[]): HTMLElement {
        const element = document.createElement(nodeType);
        classNames.forEach((className) => {
            element.classList.add(className);
        });

        return element;

    }

}
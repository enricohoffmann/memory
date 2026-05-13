import { GameOverResult, ThemeKey, TrophyType } from "../types/game.types";
import { ButtonComponent } from "./button.component";
import '../styles/components/_endScreenComponent.scss';

export class EndScreenComponent {

    private _endScreenElement: HTMLElement;

    constructor(private theme: ThemeKey, private gameEndResult: GameOverResult){
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
        this._endScreenElement.appendChild(this.buildTopElement());

        //einen Main erstellen und alle Elemente reinpacken

        //result
        this._endScreenElement.appendChild(this.buildResultMessageElement('winner'));
        //Winner
        this._endScreenElement.appendChild(this.buildWinnerMessageElement());
        //Icon
        this._endScreenElement.appendChild(this.buildTrophyElement('winner'));
        //Button
        this._endScreenElement.appendChild(this.buildBackButtonElement());
    }

    private composeWinner(): void {
        //result
        this._endScreenElement.appendChild(this.buildResultMessageElement('winner'));
        //Winner
        this._endScreenElement.appendChild(this.buildWinnerMessageElement());
        //Icon
        this._endScreenElement.appendChild(this.buildTrophyElement('winner'));
        //Button
        this._endScreenElement.appendChild(this.buildBackButtonElement());
    }

    private composeDraw(): void {
        //result
        this._endScreenElement.appendChild(this.buildResultMessageElement('winner'));
        //draw Message
        this._endScreenElement.appendChild(this.buildDrawMessageElement());
        //Icon
        this._endScreenElement.appendChild(this.buildTrophyElement('draw'));
        //Button
        this._endScreenElement.appendChild(this.buildBackButtonElement());
    }


    private buildTopElement(): HTMLElement {
        const topElement = this.createHtmlElement('div', [`${this.theme}--top`]);

        return topElement;
    }

    private buildResultMessageElement(trophyType: TrophyType): HTMLElement {
        const resultMessage = this.createHtmlElement('p', ['result-message', `result-message--${this.theme}`]);
        resultMessage.innerText = trophyType === 'winner' ? 'The winner is' : 'It´s a';
        return resultMessage;
    }

    private buildDrawMessageElement(): HTMLElement {
        const drawElement = this.createHtmlElement('h1', ['draw-headline', `draw-headline--${this.theme}`]);
        drawElement.innerText = 'DRAW';
        return drawElement;
    }


    private buildWinnerMessageElement(): HTMLElement {
        const winnerMessage = this.createHtmlElement('h1', ['winner-headline', `winner-headline--${this.theme}`]);
        let playerMessage = `${this.gameEndResult.winner.name} Player`;
        winnerMessage.innerText = this.theme === 'code-vibes' ? playerMessage.toLowerCase() : playerMessage;
        return winnerMessage;
    }

    private buildTrophyElement(trophyType: TrophyType): HTMLElement {
        let classList: string[] = [];
        classList.push('trophy', `trophy--${this.theme}`);

        trophyType === 'draw' ? classList.push(
            `trophy--${this.theme}--draw`) 
            : classList.push(`trophy--${this.theme}--winner-${this.gameEndResult.winner.color}`);
        const trophyElement = this.createHtmlElement('div', classList);
        return trophyElement;
    }

    private buildBackButtonElement(): HTMLElement {
        const button: ButtonComponent = new ButtonComponent('win-draw-btn', () => this.goBack());
        const buttonElement = button.getWinDrawBackButton(this.theme, this.theme === 'code-vibes' ? 'Back to start' : 'Home');
        return buttonElement;
    }

    private createHtmlElement(nodeType: string, classNames: string[]): HTMLElement {
        const element = document.createElement(nodeType);
        classNames.forEach((className) => {
            element.classList.add(className);
        });

        return element;

    }

    private goBack(){

    }


}
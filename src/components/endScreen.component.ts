import { GameStatus, Player, ThemeKey } from "../types/game.types";


export class EndScreenComponent {

    private _endScreenElement: HTMLElement;

    constructor(private theme: ThemeKey, private gameStatus: GameStatus, private winner: Player){
        this._endScreenElement = document.createElement('section');
        this._endScreenElement.classList.add('end-screen-section', `end-screen-section--${theme}`);
    }


    render(): HTMLElement {
        if(this.gameStatus === 'draw') {return this.composeDraw();}
        if(this.gameStatus === 'won'){
            if(this.theme === 'code-vibes'){
                return this.composeCodeVibeWinner();
            }else {
                return this.composeWinner();
            }
        }
        return this._endScreenElement;
    }


    private composeCodeVibeWinner(): HTMLElement{
        //top

        //result

        //Winner

        //Icon

        //Button
    }

    private composeWinner(): HTMLElement {
        //result

        //Winner

        //Icon

        //Button
    }

    private composeDraw(): HTMLElement {
        //result

        //draw Message

        //Icon

        //Button
    }


    private buildTopElement(): HTMLElement {

    }

    private buildResultMessageElement(): HTMLElement {

    }

    private buildDrqwMessageElement(): HTMLElement {

    }


    private buildWinnerMessageElement(): HTMLElement {

    }

    private buildTrophyElement(): HTMLElement {

    }

    private buildBackButtonElement(): HTMLElement {

    }


}
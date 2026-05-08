import { GameState, ViewName } from "../types/game.types";
import { HomeView } from "../views/home.view";
import { PlayView } from "../views/play.view";
import { SettingsView } from "../views/settings.view";

export class NavigationManager {
    constructor(private app: HTMLElement){}

    navigateTo(view: ViewName, gameState?: GameState) {
        this.app.innerHTML = '';

        if(view === 'home'){this.callHome();}
        if(view === 'settings'){this.callSettings();}
        if(view === 'play' && gameState) {this.callPlay(gameState);}
    }

    private callHome(){
        const home:HomeView = new HomeView((view) => this.navigateTo(view));
        home.render(this.app);
    }

    private callSettings(){
        const settings:SettingsView = new SettingsView((view, gameState) => this.navigateTo(view, gameState));
        settings.onInit();
        settings.render(this.app);
    }

    private callPlay(gameState: GameState){
        const play:PlayView = new PlayView(gameState, (view, gameState) => this.navigateTo(view, gameState));
        const isGameStateInit = play.initGameState();
        if(!isGameStateInit) {return;}
        play.render(this.app);
    }

}
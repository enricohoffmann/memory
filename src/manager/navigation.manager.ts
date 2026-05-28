import { GameState, ViewName } from "../types/game.types";
import { HomeView } from "../views/home.view";
import { PlayView } from "../views/play.view";
import { SettingsView } from "../views/settings.view";

/**
 * Coordinates navigation between the application's top-level views.
 *
 * The manager clears the current app container and instantiates the matching
 * view for the requested route.
 */
export class NavigationManager {
    /**
     * Creates a new navigation manager instance.
     *
     * @param app The root application element that should host the active view.
     */
    constructor(private app: HTMLElement){}

    /**
     * Navigates to the requested view and passes the game state when needed.
     *
     * @param view The name of the target view.
     * @param gameState Optional game state forwarded to settings and play views.
     */
    navigateTo(view: ViewName, gameState?: GameState) {
        this.app.innerHTML = '';

        if(view === 'home'){this.callHome();}
        if(view === 'settings'){this.callSettings(gameState);}
        if(view === 'play' && gameState) {this.callPlay(gameState);}
    }

    /**
     * Creates and renders the home view.
     */
    private callHome(): void{
        const home:HomeView = new HomeView((view) => this.navigateTo(view));
        home.render(this.app);
    }

    /**
     * Creates, initializes, and renders the settings view.
     *
     * @param gameState Optional game state used to prefill the settings view.
     */
    private callSettings(gameState?: GameState){
        const settings:SettingsView = new SettingsView((view, gameState) => this.navigateTo(view, gameState));
        settings.onInit();
        settings.render(this.app, gameState);
    }

    /**
     * Creates the play view, initializes the game state, and renders the board when initialization succeeds.
     *
     * @param gameState The game state used to start or resume the play view.
     */
    private callPlay(gameState: GameState){
        const play:PlayView = new PlayView(gameState, (view, gameState) => this.navigateTo(view, gameState));
        const isGameStateInit = play.initGameState();
        if(!isGameStateInit) {return;}
        play.render(this.app);
    }

}
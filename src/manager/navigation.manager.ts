import { ViewName } from "../types/game.types";
import { SettingsView } from "../views/settings.view";

export class NavigationManager {
    constructor(private app: HTMLElement){}

    navigateTo(view: ViewName) {
        this.app.innerHTML = '';

        if(view === 'home'){this.callHome();}
        if(view === 'settings'){this.callSettings();}
        if(view === 'play') {this.callPlay();}
    }

    private callHome(){

    }

    private callSettings(){
        const settings:SettingsView = new SettingsView((view) => this.navigateTo(view));
        settings.onInit();
        settings.render(this.app);
    }

    private callPlay(){

    }

}
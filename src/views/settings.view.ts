import { PlayerComponent } from "../components/player.component";
import { BoardSizeService } from "../services/boardSize.service";
import { PlayerService } from "../services/player.service";
import { ThemeService } from "../services/theme.service";
import { BoardSize, Player, Theme, ViewName } from "../types/game.types";


export class SettingsView {

    private themes: Theme[] = [];
    private players: Player[] = [];
    private boardSizes: BoardSize[] = [];
    private selectedStartPlayerId: string = 'player-00';
    private themeService: ThemeService;
    private playerService: PlayerService;
    private boardSizeService: BoardSizeService;
    private playerComponent: PlayerComponent;

    constructor(private navigate: (view: ViewName) => void) {
        this.themeService = new ThemeService();
        this.playerService = new PlayerService();
        this.boardSizeService = new BoardSizeService();
        this.playerComponent = new PlayerComponent();
    }

    onInit() {
        this.loadThemes();
        this.loadPlayers();
        this.loadBoardSizes();
        this.selectedStartPlayerId = 'player-00';
        this.playerComponent.onInit(this.players);
    }

    private loadThemes() {
        this.themeService.init();
        this.themes = this.themeService.getThemes();
    }

    private loadPlayers() {
        this.players = this.playerService.getPlayers();
    }

    private loadBoardSizes() {
        this.boardSizes = this.boardSizeService.getBoardSizes();
    }


    render(container: HTMLElement) {
        //this.renderSettingsSection(container);
        const playerContainer = this.buildPlayersContainer();
        const sectionContainer = this.buildSettingsSection();
        
        sectionContainer.appendChild(playerContainer);

        
        container.appendChild(sectionContainer);
    }


    private buildSettingsSection():HTMLElement {

        const settingsSection: HTMLElement = document.createElement('section');
        settingsSection.classList.add('settings-section');

        settingsSection.innerHTML = `
                <h2>Settings</h2>
                `;

        return settingsSection;
    }

    private buildPlayersContainer():HTMLElement {
        const playersContainer: HTMLElement = document.createElement('article');
        playersContainer.id = 'players-container';

        const playerContent = this.playerComponent.getPlayers(playersContainer);

        return playerContent;
    }

    /* private renderContentInContainer(content:string, containerQuery:string):void {
        const container = document.querySelector(containerQuery);
        if(container){
            container.innerHTML = content;
        }
    } */

    /* private registerEventListener(selector:string):void {
        document
        .querySelectorAll(selector)
        .forEach((button)=>{
            button.addEventListener('click', () => {
                this.radialButtonClick(button);
            });
        });
    } */

    /* private radialButtonClick(button: Element){
        const btnId = button.getAttribute('data-button-id');
        console.log(btnId);
        
    } */


}
import { SettingOptionGroupComponent } from "../components/settingOptionGroup.component";
import { BoardSizeService } from "../services/boardSize.service";
import { PlayerService } from "../services/player.service";
import { ThemeService } from "../services/theme.service";
import { BoardSize, Player, Theme, ViewName} from "../types/game.types";


export class SettingsView {

    private themes: Theme[] = [];
    private boardSizes: BoardSize[] = [];
    private selectedStartPlayerId: string = 'player-00';
    private players: Player[] = [];
    private themeService: ThemeService;
    private playerService: PlayerService;
    private boardSizeService: BoardSizeService;

    private playersComponent: SettingOptionGroupComponent;


    constructor(private navigate: (view: ViewName) => void) {
        this.themeService = new ThemeService();
        this.playerService = new PlayerService();
        this.boardSizeService = new BoardSizeService();

        this.playersComponent = new SettingOptionGroupComponent(false, (playerId) => {
            this.selectedStartPlayerId = playerId;
        });

    }

    onInit() {
        this.loadThemes();
        this.loadPlayers();
        this.loadBoardSizes();
        this.selectedStartPlayerId = 'player-00';

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
        const sectionContainer = this.buildSettingsSection();
        //const themeContainer = this.buildThemeConainer();
        const playerContainer = this.playersComponent.buildContainer(this.players, 'article');
        playerContainer.classList.add('settings-group');
        //const boardSizeContainer = this.buildBoardSizeContainer();

        this.fillSectionContainer(sectionContainer, playerContainer);

        container.appendChild(sectionContainer);
    }

    private fillSectionContainer(section: HTMLElement, playerContainer: HTMLElement) {
        section.appendChild(playerContainer);
    }

    /* private fillSectionContainer(section: HTMLElement, themesContainer: HTMLElement, playerContainer: HTMLElement, boardSizeContainer: HTMLElement){
        section.appendChild(themesContainer);
        section.appendChild(playerContainer);
        section.appendChild(boardSizeContainer);
    } */


    private buildSettingsSection(): HTMLElement {

        const settingsSection: HTMLElement = document.createElement('section');
        settingsSection.classList.add('settings-section');

        settingsSection.innerHTML = `
                <h2>Settings</h2>
                `;

        return settingsSection;
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
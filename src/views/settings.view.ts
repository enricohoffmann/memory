import { SettingOptionGroupComponent } from "../components/settingOptionGroup.component";
import { BoardSizeService } from "../services/boardSize.service";
import { PlayerService } from "../services/player.service";
import { ThemeService } from "../services/theme.service";
import { BoardSize, OptionGroup, Player, Theme, ViewName} from "../types/game.types";
import playerGroupIcon from '../assets/icons/player-group.svg';

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

        this.playersComponent = new SettingOptionGroupComponent((playerId) => {
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
        container.appendChild(sectionContainer);
        this.renderOptionGroupsIntoColumnOne();


        //const themeContainer = this.buildThemeConainer();
        
        //const boardSizeContainer = this.buildBoardSizeContainer();

        //this.fillSectionContainer(sectionContainer, playerContainer);

        
    }

    private renderOptionGroupsIntoColumnOne(){
        const columnOne = document.getElementById('setting-sub-col-one');
        if(!columnOne) {return;}


        const playerContainer = this.buildPlayerOptionGroup();
        columnOne.appendChild(playerContainer);
    }

    private buildPlayerOptionGroup(): HTMLElement {

        const playerOptionGroup: OptionGroup = {
            title: 'Choose player',
            firstElementIsActive: false,
            nodeName: 'article',
            iconPath: playerGroupIcon
        }

        const playerContainer = this.playersComponent.buildContainer(this.players, playerOptionGroup);
        playerContainer.classList.add('settings-group');

        return playerContainer;
    }

    private fillSectionContainer(section: HTMLElement, playerContainer: HTMLElement) {
        section.appendChild(playerContainer);

    }


    private buildSettingsSection(): HTMLElement {

        const settingsSection: HTMLElement = document.createElement('section');
        settingsSection.classList.add('settings-section');

        settingsSection.innerHTML = /* html */ `

                <header class='settings-section-header'>
                    <h2>Settings</h2>
                    <div class='settings-section-header__decorative-arrow'>
                        <div class='settings-section-header__decorative-arrow__diamond'></div>
                        <div class='settings-section-header__decorative-arrow__line'></div>
                    </div>
                </header>

                <main class='settings-sub-grid'>
                    <div id='setting-sub-col-one' class='settings-sub-grid__left'></div>
                    <div class="settings-sub-grid__right">
                        <div class='settings-sub-grid__right__top'></div>
                        <div class='settings-sub-grid__right__buttom'></div>
                    </div>
                </main>

                `;

        return settingsSection;
    }

    

}
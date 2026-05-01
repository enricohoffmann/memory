import { SettingOptionGroupComponent } from "../components/settingOptionGroup.component";
import { BoardSizeService } from "../services/boardSize.service";
import { PlayerService } from "../services/player.service";
import { ThemeService } from "../services/theme.service";
import { BoardSize, OptionGroupSpecification, Player, Theme, ViewName } from "../types/game.types";
import themeGroupeIcon from '../assets/icons/theme-group.svg';
import playerGroupIcon from '../assets/icons/player-group.svg';
import boardSizeIcon from '../assets/icons/bordSize-group.svg';


export class SettingsView {

    private themes: Theme[] = [];
    private players: Player[] = [];
    private boardSizes: BoardSize[] = [];

    private selectedStartPlayerId: string | null = null;;
    private selectedThemeId: string | null = null;
    private selectedBoardSizeId: string | null = null;

    private optionGroupSpecifications: OptionGroupSpecification<Theme | Player | BoardSize>[] = [];

    private themeService: ThemeService;
    private playerService: PlayerService;
    private boardSizeService: BoardSizeService;

    private themesComponent: SettingOptionGroupComponent;
    private playersComponent: SettingOptionGroupComponent;
    private boardSizeComponent: SettingOptionGroupComponent;


    constructor(private navigate: (view: ViewName) => void) {
        this.themeService = new ThemeService();
        this.playerService = new PlayerService();
        this.boardSizeService = new BoardSizeService();

        this.themesComponent = new SettingOptionGroupComponent((themeId) => {
            this.changeThemeSelection(themeId);
        });

        this.playersComponent = new SettingOptionGroupComponent((playerId) => {
            this.changePlayerSelection(playerId);
        });

        this.boardSizeComponent = new SettingOptionGroupComponent((boardSizeId) => {
            this.changeBoardSizeSelection(boardSizeId);
        });

    }

    onInit() {
        this.loadThemes();
        this.loadPlayers();
        this.loadBoardSizes();
        this.createOptionGroupSpecifications();
        this.selectedThemeId = this.themes[0].id;
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

    private changePlayerSelection(playerId: string): void {
        this.selectedStartPlayerId = playerId;
        //change View on Startbutton
    }

    private changeThemeSelection(themeId: string): void {
        this.selectedThemeId = themeId;
        this.showThemePreviewImage();
        //change View on Startbutton
    }

    private changeBoardSizeSelection(boardSizeId: string): void {
        this.selectedBoardSizeId = boardSizeId;
        //change View on Startbutton
    }

    private createOptionGroupSpecifications(): void {
        const themeOptionGroupSpecification: OptionGroupSpecification<Theme> = 
        { title: 'Game themes', firstElementIsActive: true, nodeName: 'article', iconPath: themeGroupeIcon, groupComponent: this.themesComponent, groupArray: this.themes };
        this.optionGroupSpecifications.push(themeOptionGroupSpecification);
        const playerOptionGroupSpecification: OptionGroupSpecification<Player> = 
        { title: 'Choose player', firstElementIsActive: false, nodeName: 'article', iconPath: playerGroupIcon, groupComponent: this.playersComponent, groupArray: this.players };
        this.optionGroupSpecifications.push(playerOptionGroupSpecification);
        const boardSizeOptionGroupSpecification: OptionGroupSpecification<BoardSize> = 
        { title: 'BoardSize', firstElementIsActive: false, nodeName: 'article', iconPath: boardSizeIcon, groupComponent: this.boardSizeComponent, groupArray: this.boardSizes };
        this.optionGroupSpecifications.push(boardSizeOptionGroupSpecification);
    }


    render(container: HTMLElement) {
        const sectionContainer = this.buildSettingsSection();
        container.appendChild(sectionContainer);
        this.renderOptionGroupsIntoColumnOne();
        this.showThemePreviewImage();
    }

    private renderOptionGroupsIntoColumnOne() {
        const columnOne = document.getElementById('setting-sub-col-one');
        if (!columnOne) { return; }
        this.optionGroupSpecifications.forEach((specification) => {
            const optionContainer = this.buildOptionGroupBySpecification(specification);
            columnOne.appendChild(optionContainer);
        });

    }

    private buildOptionGroupBySpecification(specification: OptionGroupSpecification<Theme | Player | BoardSize>): HTMLElement {
        const container = specification.groupComponent.buildContainer(specification);
        container.classList.add('settings-group');
        return container;
    }

    private showThemePreviewImage(){
        const imageElement = document.getElementById('theme-preview-image') as HTMLImageElement;
        if(!imageElement) { return; }
        imageElement.src = this.themeService.getThemeImageById(this.selectedThemeId || '');
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
                        <div class='settings-sub-grid__right__top'>
                            <img id='theme-preview-image' src='' name='Theme previewimage'/>
                        </div>
                        <div class='settings-sub-grid__right__buttom'></div>
                    </div>
                </main>

                `;

        return settingsSection;
    }



}
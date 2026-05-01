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
        const player = this.playerService.getPlayerById(playerId);
        if (player === null) { return; }
        this.changeSettingsSelectionContent('player', `${player.name} Player`);
    }

    private changeThemeSelection(themeId: string): void {
        this.selectedThemeId = themeId;
        this.showThemePreviewImage();
        const theme = this.themeService.getThemeById(themeId);
        if (theme === null) { return; }
        this.changeSettingsSelectionContent('theme', `${theme.selectionText}`);
    }

    private changeBoardSizeSelection(boardSizeId: string): void {
        this.selectedBoardSizeId = boardSizeId;
        const boardSize = this.boardSizeService.getBoardSizeById(boardSizeId);
        if (boardSize === null) { return; }
        this.changeSettingsSelectionContent('boardSize', `Board-${boardSize.size} Cards`);
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
        this.changeThemeSelection(this.selectedThemeId!);
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

    private showThemePreviewImage() {
        const imageElement = document.getElementById('theme-preview-image') as HTMLImageElement;
        if (!imageElement) { return; }
        imageElement.src = this.themeService.getThemeImageById(this.selectedThemeId || '');
    }

    private changeSettingsSelectionContent(selectionName: string, content: string) {
        const selectionElemets = document.querySelectorAll('#selection-container p');
        if (!selectionElemets) { return; }

        selectionElemets.forEach((element) => {
            if (element.id.startsWith(selectionName)) {
                const selectionElement = document.getElementById(element.id);
                if (selectionElement) {
                    //Fade out
                    selectionElement.innerText = content;
                    //Fade in
                }
            }

        });

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
                    <section id='setting-sub-col-one' class='settings-sub-grid__left'></section>
                    <aside class="settings-sub-grid__right">
                        <figure class='settings-sub-grid__right__top'>
                            <img id='theme-preview-image' src='' name='Theme previewimage'/>
                        </figure>
                        <dl id='selection-container' class='settings-sub-grid__right__buttom'>
                            <p id='theme-selection'>Theme</p>
                            <div class='selection-seperator selection-seperator--default'>
                                <div class='selection-seperator--default__line'></div>
                                <div class='selection-seperator--default__diamond'></div>
                            </div>
                            <p id='player-selection'>Player</p>
                            <div class='selection-seperator selection-seperator--default'>
                                <div class='selection-seperator--default__line'></div>
                                <div class='selection-seperator--default__diamond'></div>
                            </div>
                            <p id='boardSize-selection'>Board size</p>
                            <button class='setting-start-button setting-start-button--disabled'>
                                <img src='/src/assets/icons/setting-game.svg' alt='Icon'/>
                                <span>Start</span>
                            </button>
                        </dl>
                    </aside>
                </main>

                `;

        return settingsSection;
    }



}
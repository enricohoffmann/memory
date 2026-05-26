import { SettingOptionGroupComponent } from "../components/settingOptionGroup.component";
import { BoardSizeService } from "../services/boardSize.service";
import { PlayerService } from "../services/player.service";
import { ThemeService } from "../services/theme.service";
import { BoardSize, ButtonConfig, GameConfig, GameState, OptionGroupSpecification, Player, Theme, ViewName } from "../types/game.types";
import themeGroupeIcon from '../assets/icons/theme-group.svg';
import playerGroupIcon from '../assets/icons/player-group.svg';
import boardSizeIcon from '../assets/icons/bordSize-group.svg';
import { GameSetupService } from "../services/gameSetup.service";
import { ButtonComponent } from "../components/button.component";

import '../styles/views/_settings.scss';

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
    private playButton: ButtonComponent;

    constructor(private navigate: (view: ViewName, gameState?: GameState) => void) {
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

        const btnConfig: ButtonConfig = {variant: 'setting-btn', disabled: true, text: 'Start'};

        this.playButton = new ButtonComponent(btnConfig, () => this.settingStartButtonEvent());

    }

    onInit():void {
        this.loadThemes();
        this.loadPlayers();
        this.loadBoardSizes();
        this.createOptionGroupSpecifications();
        this.selectedThemeId = this.themes[0].id;
    }

    render(container: HTMLElement, gameState?: GameState):void {
        const sectionContainer = this.buildSettingsSection();
        this.renderSettingsButton(sectionContainer);
        container.appendChild(sectionContainer);
        this.renderOptionGroupsIntoColumnOne();
        this.changeThemeSelection(this.selectedThemeId!);

        if(gameState){this.loadSettingsByGameState(gameState);}
    }

    private loadThemes(): void {
        this.themeService.init();
        this.themes = this.themeService.getThemes();
    }

    private loadPlayers(): void {
        this.players = this.playerService.getPlayers();
    }

    private loadBoardSizes(): void {
        this.boardSizes = this.boardSizeService.getBoardSizes();
    }

    private loadSettingsByGameState(gameState: GameState):void {
        const themeId:string = this.themeService.getThemeIdByThemeKey(gameState.themeKey);
        this.restorThemeSelection(themeId);
        this.playersComponent.changeSelectionFromExtern(gameState.startPlayerId);
        this.changePlayerSelection(gameState.startPlayerId);
        this.boardSizeComponent.changeSelectionFromExtern(gameState.boardSize.id);
        this.changeBoardSizeSelection(gameState.boardSize.id);
    }

    private restorThemeSelection(themeId: string): void {
        this.selectedThemeId = themeId;
        this.themesComponent.changeSelectionFromExtern(themeId);
        this.changeThemeSelection(themeId);
    }

    private createOptionGroupSpecifications(): void {
        const themeOptionGroupSpecification: OptionGroupSpecification<Theme> =
            { optionName: 'theme', title: 'Game themes', firstElementIsActive: true, nodeName: 'article', iconPath: themeGroupeIcon, groupComponent: this.themesComponent, groupArray: this.themes };
        this.optionGroupSpecifications.push(themeOptionGroupSpecification);
        const playerOptionGroupSpecification: OptionGroupSpecification<Player> =
            { optionName: 'player', title: 'Choose player', firstElementIsActive: false, nodeName: 'article', iconPath: playerGroupIcon, groupComponent: this.playersComponent, groupArray: this.players };
        this.optionGroupSpecifications.push(playerOptionGroupSpecification);
        const boardSizeOptionGroupSpecification: OptionGroupSpecification<BoardSize> =
            { optionName: 'board', title: 'BoardSize', firstElementIsActive: false, nodeName: 'article', iconPath: boardSizeIcon, groupComponent: this.boardSizeComponent, groupArray: this.boardSizes };
        this.optionGroupSpecifications.push(boardSizeOptionGroupSpecification);
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
                            <p id='theme-selection' class='sumary-text sumary-text--show'>Theme</p>
                            <div class='selection-seperator selection-seperator--default'>
                                <div class='selection-seperator-line'></div>
                                <div class='selection-seperator-diamond'></div>
                            </div>
                            <p id='player-selection' class='sumary-text sumary-text--show'>Player</p>
                            <div class='selection-seperator selection-seperator--default'>
                                <div class='selection-seperator-line'></div>
                                <div class='selection-seperator-diamond'></div>
                            </div>
                            <p id='boardSize-selection' class='sumary-text sumary-text--show'>Board size</p>
                        </dl>
                    </aside>
                </main>

                `;

        return settingsSection;
    }

    private renderSettingsButton(container: HTMLElement): void {
        const selectionContainer: Element | null = container.querySelector('#selection-container');
        if(selectionContainer){
            selectionContainer.appendChild(this.playButton.renderButton());
        }

    }

    private renderOptionGroupsIntoColumnOne(): void {
        const columnOne = document.getElementById('setting-sub-col-one');
        if (!columnOne) { return; }
        this.optionGroupSpecifications.forEach((specification) => {
            const optionContainer = this.buildOptionGroupBySpecification(specification);
            columnOne.appendChild(optionContainer);
        });

    }

    private changePlayerSelection(playerId: string): void {
        this.selectedStartPlayerId = playerId;
        const player = this.playerService.getPlayerById(playerId);
        if (player === null) { return; }
        this.changeSettingsSelectionContent('player', `${player.name} Player`);
        this.checkIfAllSelectionCompleted();
    }

    private changeThemeSelection(themeId: string): void {
        this.selectedThemeId = themeId;
        this.showThemePreviewImage();
        const theme = this.themeService.getThemeById(themeId);
        if (theme === null) { return; }
        this.changeSettingsSelectionContent('theme', `${theme.selectionText}`);
        this.checkIfAllSelectionCompleted();
    }

    private changeBoardSizeSelection(boardSizeId: string): void {
        this.selectedBoardSizeId = boardSizeId;
        const boardSize = this.boardSizeService.getBoardSizeById(boardSizeId);
        if (boardSize === null) { return; }
        this.changeSettingsSelectionContent('boardSize', `Board-${boardSize.size} Cards`);
        this.checkIfAllSelectionCompleted();
    }

    private buildOptionGroupBySpecification(specification: OptionGroupSpecification<Theme | Player | BoardSize>): HTMLElement {
        const container = specification.groupComponent.buildContainer(specification);
        
        container.classList.add('settings-group');
        return container;
    }

    private showThemePreviewImage(): void {
        const imageElement = document.getElementById('theme-preview-image') as HTMLImageElement;
        if (!imageElement) { return; }
        imageElement.src = this.themeService.getThemeImageById(this.selectedThemeId || '');
    }

    private changeSettingsSelectionContent(selectionName: string, content: string): void {
        const selectionElemets = document.querySelectorAll('#selection-container p');
        if (!selectionElemets) { return; }

        selectionElemets.forEach((element) => {
            if (element.id.startsWith(selectionName)) {
                const selectionElement = document.getElementById(element.id);
                if (selectionElement) {
                    this.fadeOutSumaryText(selectionElement);

                    setTimeout(() => {
                        selectionElement.innerText = content;
                        this.fadeInSumaryText(selectionElement);
                    }, 100);

                }
            }

        });

    }

    private fadeOutSumaryText(element: HTMLElement): void {
        element.classList.add('sumary-text--hide');
        element.classList.remove('sumary-text--show');
    }

    private fadeInSumaryText(element: HTMLElement): void {
        element.classList.remove('sumary-text--hide');
        element.classList.add('sumary-text--show');
    }

    private checkIfAllSelectionCompleted() {
        if (this.selectedThemeId !== null && this.selectedStartPlayerId !== null && this.selectedBoardSizeId !== null) {
            this.playButton.enableButton();
            this.changeSelectionSeperatorView();
        }
    }

    private changeSelectionSeperatorView(): void {
        const seperators = document.querySelectorAll('.selection-seperator');
        if (!seperators) { return; }

        seperators.forEach((seperator) => {
            seperator.classList.remove('selection-seperator--default');
            seperator.classList.add('selection-seperator--completed');
        });
    }


    private settingStartButtonEvent() {
        const gameState: GameState | null = this.createNewGame();
        if (gameState) {
            gameState.status = 'running';
            this.navivigateToPlay(gameState);
        }
    }

    private createNewGame(): (GameState | null) {
        const theme = this.themeService.getThemeById(this.selectedThemeId!);
        const boardSize = this.boardSizeService.getBoardSizeById(this.selectedBoardSizeId!);
        if (!theme || !boardSize) { return null; }
        const gameConfig: GameConfig = {
            selectedTheme: theme,
            players: this.players,
            selectedStartPlayerId: this.selectedStartPlayerId!,
            selectedBoardSize: boardSize
        };
        const gameSetupService: GameSetupService = new GameSetupService();
        const gameSetupResult = gameSetupService.setupGame(gameConfig, this.themes);

        if (gameSetupResult.success && gameSetupResult.gameState) {
            return gameSetupResult.gameState;
        }

        return null;

    }

    private navivigateToPlay(gameState: GameState): void {
        this.navigate('play', gameState);
    }


}
import { SettingOptionGroupComponent } from "../components/setting-option-group.component";
import { BoardSizeService } from "../services/board-size.service";
import { PlayerService } from "../services/player.service";
import { ThemeService } from "../services/theme.service";
import { BoardSize, ButtonConfig, GameConfig, GameState, OptionGroupSpecification, Player, Theme, ViewName } from "../types/game.types";
import themeGroupeIcon from '../assets/icons/theme-group.svg';
import playerGroupIcon from '../assets/icons/player-group.svg';
import boardSizeIcon from '../assets/icons/boardSize-group.svg';
import { GameSetupService } from "../services/game-setup.service";
import { ButtonComponent } from "../components/button.component";

import '../styles/views/_settings.scss';

/**
 * Renders the settings view and coordinates all game setup selections.
 *
 * The view loads selectable options, updates the summary and preview UI,
 * validates completion state, and starts a new game when setup is complete.
 */
export class SettingsView {

  private themes: Theme[] = [];
  private players: Player[] = [];
  private boardSizes: BoardSize[] = [];

  private selectedStartPlayerId: string | null = null;
  private selectedThemeId: string | null = null;
  private selectedBoardSizeId: string | null = null;

  private optionGroupSpecifications: OptionGroupSpecification<Theme | Player | BoardSize>[] = [];

  private themeService: ThemeService;
  private playerService: PlayerService;
  private boardSizeService: BoardSizeService;
  private gameSetupService: GameSetupService;

  private themesComponent: SettingOptionGroupComponent;
  private playersComponent: SettingOptionGroupComponent;
  private boardSizeComponent: SettingOptionGroupComponent;
  private playButton: ButtonComponent;

  private previewHoverTimeout: number | null = null;
  private readonly SUMMARY_TEXT_FADE_DELAY_MS = 100;

  /**
   * Creates a new settings view instance.
   *
   * @param navigate Callback used to navigate to another view.
   */
  constructor(private navigate: (view: ViewName, gameState?: GameState) => void) {
    this.themeService = new ThemeService();
    this.playerService = new PlayerService();
    this.boardSizeService = new BoardSizeService();
    this.gameSetupService = new GameSetupService();

    this.themesComponent = new SettingOptionGroupComponent(
      (themeId) => { this.changeThemeSelection(themeId); },
      (themeId) => { this.hoverTheme(themeId); },
      () => { this.leaveThemeHover(); }
    );

    this.playersComponent = new SettingOptionGroupComponent((playerId) => {
      this.changePlayerSelection(playerId);
    });

    this.boardSizeComponent = new SettingOptionGroupComponent((boardSizeId) => {
      this.changeBoardSizeSelection(boardSizeId);
    });

    const btnConfig: ButtonConfig = { variant: 'setting-btn', disabled: true, text: 'Start' };

    this.playButton = new ButtonComponent(btnConfig, () => this.settingStartButtonEvent());

  }

  /**
   * Initializes lookup data and default selection state for the settings view.
   */
  onInit(): void {
    this.loadThemes();
    this.loadPlayers();
    this.loadBoardSizes();
    this.createOptionGroupSpecifications();
    if (this.themes.length > 0) {
      this.selectedThemeId = this.themes[0].id;
    }
  }

  /**
   * Renders the settings view into the provided container.
   *
   * @param container The target element that should host the view.
   * @param gameState Optional game state used to restore previous selections.
   */
  render(container: HTMLElement, gameState?: GameState): void {
    const sectionContainer = this.buildSettingsSection();
    this.renderSettingsButtonIntoContainer(sectionContainer);
    container.appendChild(sectionContainer);
    this.renderOptionGroupsIntoColumnOne();
    this.changeThemeSelection(this.selectedThemeId!);

    if (gameState) { this.loadSettingsByGameState(gameState); }
  }

  /**
   * Loads available themes from the theme service.
   */
  private loadThemes(): void {
    this.themeService.init();
    this.themes = this.themeService.getThemes();
  }

  /**
   * Loads available players from the player service.
   */
  private loadPlayers(): void {
    this.players = this.playerService.getPlayers();
  }

  /**
   * Loads available board sizes from the board size service.
   */
  private loadBoardSizes(): void {
    this.boardSizes = this.boardSizeService.getBoardSizes();
  }

  /**
   * Restores selections from an existing game state.
   *
   * @param gameState The saved game state used to re-apply selections.
   */
  private loadSettingsByGameState(gameState: GameState): void {
    const themeId: string = this.themeService.getThemeIdByThemeKey(gameState.themeKey);
    this.restoreThemeSelection(themeId);
    this.playersComponent.changeSelectionFromExtern(gameState.startPlayerId);
    this.changePlayerSelection(gameState.startPlayerId);
    this.boardSizeComponent.changeSelectionFromExtern(gameState.boardSize.id);
    this.changeBoardSizeSelection(gameState.boardSize.id);
  }

  /**
   * Restores and applies a previously selected theme id.
   *
   * @param themeId The theme id to restore.
   */
  private restoreThemeSelection(themeId: string): void {
    this.selectedThemeId = themeId;
    this.themesComponent.changeSelectionFromExtern(themeId);
    this.changeThemeSelection(themeId);
  }

  /**
   * Creates all option-group specifications used by the settings form.
   */
  private createOptionGroupSpecifications(): void {
    this.optionGroupSpecifications = [];

    const themeOptionGroupSpecification: OptionGroupSpecification<Theme> = this.createThemeOptionGroupSpecification();
    this.optionGroupSpecifications.push(themeOptionGroupSpecification);
    const playerOptionGroupSpecification: OptionGroupSpecification<Player> = this.createPlayerOptionGroupSpecification();
    this.optionGroupSpecifications.push(playerOptionGroupSpecification);
    const boardSizeOptionGroupSpecification: OptionGroupSpecification<BoardSize> = this.createBoardSizeOptionGroupSpecification();
    this.optionGroupSpecifications.push(boardSizeOptionGroupSpecification);
  }

  /**
   * Creates the option group specification for themes.
   * @returns The theme option group specification.
   */
  private createThemeOptionGroupSpecification(): OptionGroupSpecification<Theme> {
    return { optionName: 'theme', title: 'Game themes', firstElementIsActive: true, nodeName: 'article', iconPath: themeGroupeIcon, groupComponent: this.themesComponent, groupArray: this.themes };
  }

  /**
   * Creates the option group specification for players.
   * @returns The player option group specification.
   */
  private createPlayerOptionGroupSpecification(): OptionGroupSpecification<Player> {
    return { optionName: 'player', title: 'Choose player', firstElementIsActive: false, nodeName: 'article', iconPath: playerGroupIcon, groupComponent: this.playersComponent, groupArray: this.players };
  }

  /**
   * Creates the option group specification for board sizes.
   * @returns The board size option group specification.
   */
  private createBoardSizeOptionGroupSpecification(): OptionGroupSpecification<BoardSize> {
    return { optionName: 'board', title: 'BoardSize', firstElementIsActive: false, nodeName: 'article', iconPath: boardSizeIcon, groupComponent: this.boardSizeComponent, groupArray: this.boardSizes };
  }

  /**
   * Builds the root settings section including static markup.
   *
   * @returns The created settings section element.
   */
  private buildSettingsSection(): HTMLElement {

    const settingsSection: HTMLElement = document.createElement('section');
    settingsSection.classList.add('settings-section');
    settingsSection.innerHTML = this.settingsHtmlTemplate();
    return settingsSection;
  }


  /**
   * Generates the HTML template for the settings section.
   *
   * @returns The HTML string representing the settings section.
   */
  private settingsHtmlTemplate(): string {
    return /* html */ `
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
              <p id='theme-selection' class='summary-text summary-text--show'>Theme</p>
              <div class='selection-separator selection-separator--default'>
                <div class='selection-separator-line'></div>
                <div class='selection-separator-diamond'></div>
              </div>
              <p id='player-selection' class='summary-text summary-text--show'>Player</p>
              <div class='selection-separator selection-separator--default'>
                <div class='selection-separator-line'></div>
                <div class='selection-separator-diamond'></div>
              </div>
              <p id='boardSize-selection' class='summary-text summary-text--show'>Board size</p>
            </dl>
          </aside>
        </main>
    `
  }


  /**
   * Renders the settings button inside the provided container.
   *
   * @param container The container element where the settings button will be rendered.
   */
  private renderSettingsButtonIntoContainer(container: HTMLElement): void {
    const selectionContainer: Element | null = container.querySelector('#selection-container');
    if (selectionContainer) {
      selectionContainer.appendChild(this.playButton.renderButton());
    }

  }

  /**
   * Renders all option groups into the left settings column.
   */
  private renderOptionGroupsIntoColumnOne(): void {
    const columnOne = document.getElementById('setting-sub-col-one');
    if (!columnOne) { return; }
    this.optionGroupSpecifications.forEach((specification) => {
      const optionContainer = this.buildOptionGroupBySpecification(specification);
      columnOne.appendChild(optionContainer);
    });

  }

  /**
   * Handles theme hover and debounces preview image updates.
   *
   * @param themeId The hovered theme id.
   */
  private hoverTheme(themeId: string): void {
    if (this.previewHoverTimeout) { clearTimeout(this.previewHoverTimeout); }

    this.previewHoverTimeout = window.setTimeout(() => {
      this.showThemePreviewImage(themeId);
    }, 120);
  }

  /**
   * Restores the preview image to the currently selected theme after hover leaves.
   */
  private leaveThemeHover(): void {
    if (this.previewHoverTimeout) { clearTimeout(this.previewHoverTimeout); }
    if (this.selectedThemeId) {
      this.showThemePreviewImage(this.selectedThemeId);
    }
  }


  /**
   * Applies a new player selection and updates the settings summary.
   *
   * @param playerId The selected player id.
   */
  private changePlayerSelection(playerId: string): void {
    this.selectedStartPlayerId = playerId;
    const player = this.playerService.getPlayerById(playerId);
    if (player === null) { return; }
    this.changeSettingsSelectionContent('player', `${player.name} Player`);
    this.checkIfAllSelectionCompleted();
  }

  /**
   * Applies a new theme selection, updates preview image, and updates summary text.
   *
   * @param themeId The selected theme id.
   */
  private changeThemeSelection(themeId: string): void {
    this.selectedThemeId = themeId;
    this.showThemePreviewImage(themeId);
    const theme = this.themeService.getThemeById(themeId);
    if (theme === null) { return; }
    this.changeSettingsSelectionContent('theme', `${theme.selectionText}`);
    this.checkIfAllSelectionCompleted();
  }

  /**
   * Applies a new board size selection and updates the settings summary.
   *
   * @param boardSizeId The selected board size id.
   */
  private changeBoardSizeSelection(boardSizeId: string): void {
    this.selectedBoardSizeId = boardSizeId;
    const boardSize = this.boardSizeService.getBoardSizeById(boardSizeId);
    if (boardSize === null) { return; }
    this.changeSettingsSelectionContent('boardSize', `Board-${boardSize.size} Cards`);
    this.checkIfAllSelectionCompleted();
  }

  /**
   * Builds an option group container based on a specification object.
   *
   * @param specification The option-group configuration.
   * @returns The generated option-group container.
   */
  private buildOptionGroupBySpecification(specification: OptionGroupSpecification<Theme | Player | BoardSize>): HTMLElement {
    const container = specification.groupComponent.buildContainer(specification);

    container.classList.add('settings-group');
    return container;
  }

  /**
   * Updates the preview image for the given theme id.
   *
   * @param themeId The theme id used to resolve the preview image source.
   */
  private showThemePreviewImage(themeId: string): void {
    const imageElement = document.getElementById('theme-preview-image') as HTMLImageElement;
    if (!imageElement) { return; }
    imageElement.src = this.themeService.getThemeImageById(themeId);
  }

  /**
   * Updates one summary line with a short fade transition.
   *
   * @param selectionName The summary key prefix to match.
   * @param content The text content to display.
   */
  private changeSettingsSelectionContent(selectionName: string, content: string): void {
    const selectionElement = this.findSelectionElement(selectionName);
    if (!selectionElement) { return; }
    this.updateSelectionTextWithFade(selectionElement, content);
  }

  /**
   * Finds the settings summary element for a given selection key.
   *
   * @param selectionName The summary key prefix to match.
   * @returns The matching summary element or `null`.
   */
  private findSelectionElement(selectionName: string): HTMLElement | null {
    const selector = `#selection-container p[id^='${selectionName}']`;
    const selectionElement = document.querySelector(selector);
    if (!(selectionElement instanceof HTMLElement)) { return null; }
    return selectionElement;
  }

  /**
   * Updates a summary element with fade-out and fade-in transitions.
   *
   * @param element The summary element to update.
   * @param content The text content to display.
   */
  private updateSelectionTextWithFade(element: HTMLElement, content: string): void {
    this.fadeOutSummaryText(element);
    setTimeout(() => {
      element.innerText = content;
      this.fadeInSummaryText(element);
    }, this.SUMMARY_TEXT_FADE_DELAY_MS);
  }

  /**
   * Applies the fade-out class state for a summary label.
   *
   * @param element The summary element to update.
   */
  private fadeOutSummaryText(element: HTMLElement): void {
    element.classList.add('summary-text--hide');
    element.classList.remove('summary-text--show');
  }

  /**
   * Applies the fade-in class state for a summary label.
   *
   * @param element The summary element to update.
   */
  private fadeInSummaryText(element: HTMLElement): void {
    element.classList.remove('summary-text--hide');
    element.classList.add('summary-text--show');
  }

  /**
   * Enables the start button when all required selections are set.
   */
  private checkIfAllSelectionCompleted(): void {
    if (this.selectedThemeId !== null && this.selectedStartPlayerId !== null && this.selectedBoardSizeId !== null) {
      this.playButton.enableButton();
      this.changeSelectionSeparatorView();
    }
  }

  /**
   * Switches all summary separators to their completed visual state.
   */
  private changeSelectionSeparatorView(): void {
    const separators = document.querySelectorAll('.selection-separator');

    separators.forEach((separator) => {
      separator.classList.remove('selection-separator--default');
      separator.classList.add('selection-separator--completed');
    });
  }


  /**
   * Triggers game setup and navigates to play when setup succeeds.
   */
  private settingStartButtonEvent(): void {
    const gameState: GameState | null = this.createNewGame();
    if (gameState) {
      gameState.status = 'running';
      this.navigateToPlay(gameState);
    }
  }

  /**
   * Creates a new game state from the current settings selection.
   *
   * @returns The created game state, or `null` when setup validation fails.
   */
  private createNewGame(): (GameState | null) {
    if (!this.selectedThemeId || !this.selectedBoardSizeId || !this.selectedStartPlayerId) { return null; }

    const theme = this.themeService.getThemeById(this.selectedThemeId);
    const boardSize = this.boardSizeService.getBoardSizeById(this.selectedBoardSizeId);
    if (!theme || !boardSize) { return null; }

    const gameConfig: GameConfig = this.createNewGameConfig(theme, boardSize, this.selectedStartPlayerId);
    const gameSetupResult = this.gameSetupService.setupGame(gameConfig, this.themes);
    return gameSetupResult.success ? (gameSetupResult.gameState ?? null) : null;

  }

  /**
   * Creates a new game configuration object from the current selections.
   * @param theme The selected theme.
   * @param boardSize The selected board size.
   * @param selectedStartPlayerId The selected start player id.
   * @returns The created game configuration object.
   */
  private createNewGameConfig(theme: Theme, boardSize: BoardSize, selectedStartPlayerId: string): GameConfig {
    return {
      selectedTheme: theme,
      players: this.players,
      selectedStartPlayerId,
      selectedBoardSize: boardSize
    };
  }

  /**
   * Navigates to the play view with the prepared game state.
   *
   * @param gameState The game state used to start gameplay.
   */
  private navigateToPlay(gameState: GameState): void {
    this.navigate('play', gameState);
  }


}
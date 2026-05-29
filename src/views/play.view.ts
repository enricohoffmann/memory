import { CardComponent } from "../components/card.component";
import { PlayService } from "../services/play.service";
import { ButtonConfig, Card, CompareCardsResult, GameState, ViewName } from "../types/game.types";
import { ButtonComponent } from "../components/button.component";
import { PlayerScoreBoardComponent } from "../components/player-score-board.component";
import { GameOverComponent } from "../components/game-over.component";
import { EndScreenComponent } from "../components/end-screen.component";
import { DialogComponent } from "../components/dialog.component";
import '../styles/views/_play.scss';

/**
 * Renders and controls the full gameplay view.
 *
 * The view builds the board, connects UI interactions to the play service,
 * updates score and turn indicators, and handles dialog and game-over overlays.
 */
export class PlayView {

  private _playService: PlayService;
  private _scoreBoard: PlayerScoreBoardComponent;
  private _wrapperElement: HTMLElement | null = null;
  private readonly PLAYER_ONE_CLASS = 'header-currentPlayer-container__current-icon--one';
  private readonly PLAYER_TWO_CLASS = 'header-currentPlayer-container__current-icon--two';
  private readonly TURN_BACK_DELAY_MS = 1000;
  private readonly GAME_OVER_DELAY_MS = 2000;
  private readonly RESULT_SCREEN_DELAY_MS = 1500;

  /**
   * Creates a new play view instance.
   *
   * @param gameState The game state used to render and continue gameplay.
   * @param navigate Callback used to navigate to other views.
   */
  constructor(
    private gameState: GameState,
    private navigate: (view: ViewName, gameState?: GameState) => void
  ) {
    this._playService = new PlayService(gameState);
    this._scoreBoard = new PlayerScoreBoardComponent(this._playService.themeKey, 'play');
  }

  /**
   * Renders the complete play view into the provided container.
   *
   * @param container The target element that should host the play view.
   */
  render(container: HTMLElement): void {
    this.initWrapper();
    if (!this._wrapperElement) { return; }
    const wrapperElement = this._wrapperElement;
    const playSection = this.composePlaySection();
    wrapperElement.appendChild(playSection);

    this._wrapperElement = this.addOverlayToWrapper(wrapperElement);
    container.appendChild(wrapperElement);
    this.restoreGameFromGameState();

  }

  /**
   * Clears the current wrapper element to prepare for a fresh render.
   */
  private initWrapper(): void {
    if (this._wrapperElement) {
      this._wrapperElement.remove();
      this._wrapperElement = null;
    }
    this._wrapperElement = this.buildWrapper();
  }

  /**
   * Composes the main play section, including header and main content.
   * @returns The assembled play section element.
   */
  private composePlaySection(): HTMLElement {
    const playSection = this.buildPlaySection();

    const header = this.composeHeader();
    playSection.appendChild(header);

    const mainSection = this.buildMainSection();
    playSection.appendChild(mainSection);
    return playSection;
  }

  /**
   * Initializes game state prerequisites before rendering.
   *
   * @returns `true` when initialization can proceed.
   */
  initGameState(): boolean {
    return true;
  }

  /**
   * Restores visual and gameplay state from the current game state snapshot.
   */
  private restoreGameFromGameState(): void {
    this.showCurrentPlayer();
    this._scoreBoard.showScoreForPlayers(this._playService.getPlayers());
    this._playService.resetCardsForRestore();
    if (this._playService.canRestoreMatchedCards()) {
      this.restoreMatchedCardsView();
    }
  }

  /**
   * Reapplies matched-card visuals after restoring persisted match state.
   */
  private restoreMatchedCardsView(): void {
    const matchedCards = this._playService.restoreMatchedCardsArray();
    matchedCards.forEach((card) => {
      card.flipCard();
    });

    this.showMatchedCards();
  }

  /**
   * Builds the outer wrapper for the play view.
   *
   * @returns The wrapper element for the play screen.
   */
  private buildWrapper(): HTMLElement {
    const wrapper: HTMLElement = document.createElement('div');
    wrapper.classList.add('play-wrapper');
    wrapper.classList.add(`play-wrapper--${this._playService.themeKey}`);
    return wrapper;
  }

  /**
   * Appends all overlay containers required by the play view.
   *
   * @param wrapper The wrapper element that receives overlay containers.
   * @returns The same wrapper element with attached overlays.
   */
  private addOverlayToWrapper(wrapper: HTMLElement): HTMLElement {
    wrapper.appendChild(this.buildOverlayContainer('exit-dialog'));
    wrapper.appendChild(this.buildOverlayContainer('game-over-container'));
    wrapper.appendChild(this.buildOverlayContainer('play-result-container'));
    return wrapper;
  }

  /**
   * Builds the main play section container.
   *
   * @returns The section element hosting header and board.
   */
  private buildPlaySection(): HTMLElement {
    const playSection: HTMLElement = document.createElement('section');
    playSection.classList.add('play-section');
    return playSection;
  }

  /**
   * Composes and returns the header area of the play view.
   *
   * @returns The assembled header element.
   */
  private composeHeader(): HTMLElement {
    const headerSection = this.buildHeaderSection();
    const scoreBoardElement = this._scoreBoard.render();
    headerSection.appendChild(scoreBoardElement);
    const currentPlayerElement = this.buildCurrentPlayerContainer();
    headerSection.appendChild(currentPlayerElement);
    this.renderDialogButton(headerSection);
    return headerSection;
  }

  /**
   * Builds the themed header root element.
   *
   * @returns The created header element.
   */
  private buildHeaderSection(): HTMLElement {
    const headerSection: HTMLElement = document.createElement('header');
    headerSection.classList.add('header-section');
    headerSection.classList.add(`header-section--${this._playService.themeKey}`);
    return headerSection;
  }

  /**
   * Builds the current-player indicator container.
   *
   * @returns The created current-player container element.
   */
  private buildCurrentPlayerContainer(): HTMLElement {
    const container: HTMLElement = document.createElement('div');
    container.classList.add('header-currentPlayer-container', `header-currentPlayer-container--${this._playService.themeKey}`);
    container.innerHTML = this.currentPlayerHtmlTemplate();
    return container;
  }

  /**
   * Returns the HTML template for the current-player indicator.
   *
   * @returns The HTML template string for the current-player container.
   */
  private currentPlayerHtmlTemplate(): string {
    return /* html */ `
      <span>Current player:</span>
      <div id='current-player-icon' class='header-currentPlayer-container__current-icon icon-hide'></div>
    `;
  }

  /**
   * Renders the exit dialog button in the header.
   *
   * @param headerSection The header element receiving the button.
   */
  private renderDialogButton(headerSection: HTMLElement): void {
    const btnConfig: ButtonConfig = {
      variant: 'exit-btn', text: 'Exit game', theme: this._playService.themeKey, hasIcon: true
    };
    const button: ButtonComponent = new ButtonComponent(btnConfig, () => this.showDialog());
    headerSection.appendChild(button.renderButton());
  }

  /**
   * Updates and animates the current-player indicator icon.
   */
  private showCurrentPlayer(): void {
    const playerIcon = this.setupPlayerIcon();
    if (!playerIcon) {
      return;
    }

    requestAnimationFrame(() => {
      playerIcon.classList.remove('icon-hide');
      playerIcon.classList.add('icon-show');
    });
  }

  /**
   * Prepares the current-player icon classes before the show animation.
   *
   * @returns The icon element, or `null` when the icon is not available.
   */
  private setupPlayerIcon(): HTMLElement | null {
    const playerIcon = document.getElementById('current-player-icon');
    if (!playerIcon) { return null; }

    playerIcon.classList.remove('icon-show');
    playerIcon.classList.add('icon-hide');
    playerIcon.classList.remove(this.PLAYER_ONE_CLASS, this.PLAYER_TWO_CLASS);

    const currentPlayerClass = this._playService.currentPlayerId.endsWith('01') ? this.PLAYER_ONE_CLASS : this.PLAYER_TWO_CLASS;
    playerIcon.classList.add(currentPlayerClass);
    return playerIcon;
  }

  /**
   * Builds the main playing field and card components.
   *
   * @returns The populated main section element.
   */
  private buildMainSection(): HTMLElement {
    const mainSection: HTMLElement = document.createElement('main');
    mainSection.classList.add(`playing-field-section`);
    mainSection.classList.add(`playing-field-section--${this._playService.boardSize.rows}-${this._playService.boardSize.columns}`);

    this.gameState.cards.forEach((card) => {
      const cardElement = new CardComponent(card, this._playService.themeKey, (c) => this.cardSelected(c));
      this._playService.addCardToCardComponents(cardElement);
      mainSection.appendChild(cardElement.buildCard());
    });

    return mainSection;
  }

  /**
   * Builds a generic overlay container by id.
   *
   * @param elementId The id assigned to the overlay element.
   * @returns The created overlay container.
   */
  private buildOverlayContainer(elementId: string): HTMLElement {
    const overlayContainer = document.createElement('div');
    overlayContainer.classList.add('overlay-container');
    overlayContainer.id = elementId;
    return overlayContainer;
  }

  /**
   * Handles a card selection from the board.
   *
   * @param card The selected card model.
   */
  private cardSelected(card: Card): void {
    if (card.isFlipped) { return; }
    if (this._playService.twoCardsAlreadySelected) { return; }

    const currentCard: CardComponent | null = this._playService.addSelectedCard(card.id);

    if (!currentCard) { return; }
    this.flipSelectedCard(currentCard);

    if (this._playService.twoCardsAlreadySelected) {
      const result: CompareCardsResult = this._playService.compareSelection();
      this.processTheCompareResult(result);
    }

  }

  /**
   * Processes the compare result and updates UI state accordingly.
   *
   * @param result The result returned from the card comparison flow.
   */
  private async processTheCompareResult(result: CompareCardsResult): Promise<void> {
    if (result.result === 'failed') { return; }
    this.showCurrentPlayer();
    await this.handleUnsuccessfulResult(result);
    this.handleGameOverResult(result);
    this.handleSuccessfulResult(result);
    this._playService.clearSelectedCards();

  }

  /**
   * Handles UI updates for an unsuccessful card comparison.
   *
   * @param result The comparison result from the play service.
   */
  private async handleUnsuccessfulResult(result: CompareCardsResult): Promise<void> {
    if (result.result !== 'unsuccessful') { return; }
    const [firstCard, secondCard] = result.cardsToTurnBack ?? [];
    if (!firstCard || !secondCard) { return; }
    await this.turnSelectedCardsBack(firstCard, secondCard);
  }

  /**
   * Handles UI updates for a successful card comparison.
   *
   * @param result The comparison result from the play service.
   */
  private handleSuccessfulResult(result: CompareCardsResult): void {
    if (result.result !== 'successfully') { return; }
    this._scoreBoard.showScoreForPlayers(this._playService.getPlayers());
    this.showMatchedCards();
  }

  /**
   * Handles UI updates for a game-over card comparison.
   *
   * @param result The comparison result from the play service.
   */
  private handleGameOverResult(result: CompareCardsResult): void {
    if (result.result === 'gameOver') { this.handleGameOver(); }
  }

  /**
   * Flips a selected card component.
   *
   * @param card The selected card component.
   */
  private flipSelectedCard(card: CardComponent): void {
    card.flipCard();
  }

  /**
   * Turns back the two selected cards after a delay.
   *
   * @param firstCard The first card component to flip back.
   * @param secondCard The second card component to flip back.
   * @returns A promise that resolves after both cards are turned back.
   */
  private async turnSelectedCardsBack(firstCard: CardComponent, secondCard: CardComponent): Promise<void> {
    await this.delay(this.TURN_BACK_DELAY_MS);
    firstCard.turnCardBack();
    secondCard.turnCardBack();
  }

  /**
   * Waits for the provided amount of milliseconds.
   *
   * @param milliseconds The delay duration in milliseconds.
   * @returns A promise that resolves after the delay.
   */
  private delay(milliseconds: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }

  /**
   * Applies matched styling to all currently matched cards.
   */
  private showMatchedCards(): void {
    const mCards: CardComponent[] = this._playService.matchedCards;

    mCards.forEach((card) => {
      card.setCardMatched(true);
    });
  }

  /**
   * Shows the exit confirmation dialog overlay.
   */
  private showDialog(): void {
    const exitDialogOverlay = document.getElementById('exit-dialog');
    if (!exitDialogOverlay) { return; }

    const dialogContent: DialogComponent = this.createExitDialog(exitDialogOverlay);

    exitDialogOverlay.appendChild(dialogContent.renderDialog());
    exitDialogOverlay.classList.add('overlay-container', 'overlay-container--show');

    requestAnimationFrame(() => {
      dialogContent.showDialog();
    });

  }

  /**
   * Creates the exit dialog instance with wired callbacks.
   *
   * @param dialogOverlay The overlay hosting the dialog.
   * @returns The created dialog component.
   */
  private createExitDialog(dialogOverlay: HTMLElement): DialogComponent {
    const dialogContent = new DialogComponent(
      this._playService.themeKey,
      () => this.exitThisGame(),
      () => this.closeDialog(dialogContent, dialogOverlay));
    return dialogContent;
  }

  /**
   * Hides the dialog and closes the overlay when the hide animation has finished.
   *
   * @param dialog The dialog instance to hide.
   * @param overlay The overlay element that hosts the dialog.
   */
  private async closeDialog(dialog: DialogComponent, overlay: HTMLElement): Promise<void> {
    const res = await dialog.hideDialog();
    if (res) {
      overlay.classList.remove('overlay-container--show');
    }
  }

  /**
   * Quits the current game and navigates back to settings.
   */
  private exitThisGame(): void {
    this._playService.quitGameState();
    this.navigate('settings', this._playService.gameState);
  }

  /**
   * Triggers the staged game-over presentation flow.
   */
  private handleGameOver(): void {
    setTimeout(() => {
      this.showGameOver();
      setTimeout(() => {
        this.showPlayEndScreen();
      }, this.RESULT_SCREEN_DELAY_MS);
    }, this.GAME_OVER_DELAY_MS);
  }

  /**
   * Shows the game-over overlay stage.
   */
  private showGameOver(): void {
    const gameOver = document.getElementById('game-over-container');
    if (gameOver) {
      const gameOverSection: GameOverComponent = new GameOverComponent(this._playService.themeKey);
      const gameOverElement = gameOverSection.buildGameOverElement(this._playService.getPlayers());
      gameOver.appendChild(gameOverElement);
      gameOver.classList.add('overlay-container--slide');
      requestAnimationFrame(() => {
        gameOver.classList.add('overlay-container--show');
      });
    }
  }

  /**
   * Shows the final play result overlay stage.
   */
  private showPlayEndScreen(): void {
    const endScreen = document.getElementById('play-result-container');
    if (endScreen) {
      const endScreenComponent: EndScreenComponent = new EndScreenComponent(
        this._playService.themeKey, this._playService.gameOverResult, () => this.exitThisGame());
      const endScreenElement = endScreenComponent.render();
      endScreen.appendChild(endScreenElement);
      requestAnimationFrame(() => {
        endScreen.classList.add('overlay-container--slide', 'overlay-container--show');
      });
    }
  }

}
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
    let wrapper = this.buildWrapper();
    const playSection = this.buildPlaySection();
    wrapper.appendChild(playSection);
    const header = this.composeHeader();
    playSection.appendChild(header);
    const mainSection = this.buildMainSection();
    playSection.appendChild(mainSection);
    wrapper = this.addOverlayToWrapper(wrapper);
    container.appendChild(wrapper);
    this.restoreGameFromGameState();

  }

  /**
   * Initializes game state prerequisites before rendering.
   *
   * @returns `true` when initialization can proceed.
   */
  initGameState(): boolean {
    return true;
  }

  private restoreGameFromGameState(): void {
    this.showCurrentPlayer();
    this._scoreBoard.showScoreForPlayers(this._playService.getPlayers()); 
    this._playService.resetCardsForRestore();
    if(this._playService.canRestoreMatchedCards()) {
      this.restoreMatchedCardsView();
    }
  }

  private restoreMatchedCardsView(): void {
    const matchedCards = this._playService.restoreMatchedCardsArray();

    matchedCards.forEach((card) => {
      card.flipCard();
    });

    this.showMatchedCards();
  }


  private buildWrapper(): HTMLElement {
    const wrapper: HTMLElement = document.createElement('div');
    wrapper.classList.add('play-wrapper');
    wrapper.classList.add(`play-wrapper--${this._playService.themeKey}`);
    return wrapper;
  }

  private addOverlayToWrapper(wrapper: HTMLElement): HTMLElement {
    wrapper.appendChild(this.buildOverlayContainerContainer('exit-dialog'));
    wrapper.appendChild(this.buildOverlayContainerContainer('game-over-container'));
    wrapper.appendChild(this.buildOverlayContainerContainer('play-result-container'));
    return wrapper;
  }

  private buildPlaySection(): HTMLElement {
    const playSection: HTMLElement = document.createElement('section');
    playSection.classList.add('play-section');
    return playSection;
  }

  private composeHeader(): HTMLElement {
    const headerSection = this.buildHeaderSection();
    const scoreBoardElement = this._scoreBoard.render();
    headerSection.appendChild(scoreBoardElement);
    const currentPlayerElement = this.buildCurrentPlayerContainer();
    headerSection.appendChild(currentPlayerElement);
    this.renderDialogButton(headerSection);
    return headerSection;
  }

  private buildHeaderSection(): HTMLElement {
    const headerSection: HTMLElement = document.createElement('header');
    headerSection.classList.add('header-section');
    headerSection.classList.add(`header-section--${this._playService.themeKey}`);
    return headerSection;
  }

  private buildCurrentPlayerContainer(): HTMLElement {
    const container: HTMLElement = document.createElement('div');
    container.classList.add('header-currentPlayer-container', `header-currentPlayer-container--${this._playService.themeKey}`);
    container.innerHTML = this.currentPlayerHtmlTemplate();
    return container;
  }

  private currentPlayerHtmlTemplate(): string {
    return /* html */ `
      <span>Current player:</span>
      <div id='current-player-icon' class='header-currentPlayer-container__current-icon icon-hide'></div>
    `;
  }

  private renderDialogButton(headerSection: HTMLElement): void {
    const btnConfig: ButtonConfig = {
      variant: 'exit-btn', text: 'Exit game', theme: this._playService.themeKey, hasIcon: true
    };
    const button: ButtonComponent = new ButtonComponent(btnConfig, () => this.showDialog());
    headerSection.appendChild(button.renderButton());
  }

  private showCurrentPlayer(): void {
    const playerIcon = document.getElementById('current-player-icon');
    if (!playerIcon) return;

    playerIcon.classList.remove('icon-show');
    playerIcon.classList.add('icon-hide');

    const playerOneClass = 'header-currentPlayer-container__current-icon--one';
    const playerTwoClass = 'header-currentPlayer-container__current-icon--two';

    playerIcon.classList.remove(playerOneClass, playerTwoClass);

    const currentPlayerClass = this._playService.currentPlayerId.endsWith('01') ? playerOneClass : playerTwoClass;

    playerIcon.classList.add(currentPlayerClass);

    requestAnimationFrame(() => {
      playerIcon.classList.remove('icon-hide');
      playerIcon.classList.add('icon-show');
    });


  }

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

  private buildOverlayContainerContainer(elementId: string): HTMLElement {
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
    if (this._playService.twoCardsAlreadySelected) {
      return;
    }

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
    if (result.result === 'unsuccessful') { await this.turnSelectedCardsBack(result.cardsToTurnBack!); }
    if (result.result === 'gameOver') { this.handleGameOver(); }
    this.showCurrentPlayer();
    if (result.result === 'successfully') { 
      this._scoreBoard.showScoreForPlayers(this._playService.getPlayers()); 
      this.showMatchedCards();
    }
    this._playService.clearSelectedCards();
    
  }

  private flipSelectedCard(card: CardComponent): void {
    card.flipCard();
  }

  private turnSelectedCardsBack(cards: CardComponent[]): Promise<void> {

    return new Promise((resolve) => {
      setTimeout(() => {
        cards[0].turnCardBack();
        cards[1].turnCardBack();
        resolve();
      }, 1000);
    });

  }

  private showMatchedCards(): void {
    const mCards:CardComponent[] = this._playService.matchedCards;

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

    const dialogContent: DialogComponent = new DialogComponent(
      this._playService.themeKey,
      () => this.exitThisGame(),
      () => this.closeDialog(dialogContent, exitDialogOverlay));

    exitDialogOverlay.appendChild(dialogContent.renderDialog());
    exitDialogOverlay.classList.add('overlay-container', 'overlay-container--show');

    requestAnimationFrame(() => {
      dialogContent.showDialog();
    });

  }

  /**
   * Hides the dialog and closes the overlay when the hide animation has finished.
   *
   * @param dialog The dialog instance to hide.
   * @param overlay The overlay element that hosts the dialog.
   */
  private async closeDialog(dialog: DialogComponent, overlay: HTMLElement): Promise<void> {
    const res = await dialog.hideDialog();
    if(res){
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
      }, 1500);

    }, 2000);
  }

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
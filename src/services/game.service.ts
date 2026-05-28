import { Player, Card, BoardSize, GameState, Theme, GameConfig } from "../types/game.types";

/**
 * Creates a playable game state from the selected game configuration.
 *
 * The service derives the active players, theme, board size, and start player,
 * then builds and shuffles the card set used for a new game.
 */
export class GameService {

  private readonly players: Player[];
  private readonly theme: Theme;
  private boardSize: BoardSize;
  private selectedPlayerId: string;
  private startPlayerId: string;

  /**
   * Creates a new game service instance.
   *
   * @param gameConfig The selected game configuration used to initialize a new game.
   */
  constructor(gameConfig: GameConfig) {
    this.theme = gameConfig.selectedTheme;
    this.players = gameConfig.players;
    this.boardSize = gameConfig.selectedBoardSize;
    this.selectedPlayerId = gameConfig.selectedStartPlayerId;
    this.startPlayerId = gameConfig.selectedStartPlayerId;
  }

  /**
   * Creates the initial game state for a new match.
   *
   * @returns A fully initialized game state with shuffled cards and active player data.
   */
  initGame(): GameState {
    const facePaths = this.getFacePathsBasedOnBoardSize();
    const cardsRaw = this.createCardSet(facePaths);
    const cardsToPlay = this.shuffleArray(cardsRaw);
    const newGameState = this.createNewGameState(cardsToPlay);
    return newGameState;
  }

  /**
   * Builds the initial game state object from the shuffled cards.
   *
   * @param cardsToPlay The shuffled cards used in the match.
   * @returns The initialized game state.
   */
  private createNewGameState(cardsToPlay: Card[]): GameState {
    return {
      players: this.players,
      currentPlayerId: this.selectedPlayerId,
      startPlayerId: this.startPlayerId,
      cards: cardsToPlay,
      selectedCards: [],
      matchedCards: [],
      themeKey: this.theme.key,
      boardSize: this.boardSize,
      status: 'running'
    };
  }

  /**
   * Selects the face images needed for the configured board size.
   *
   * @returns The shuffled and sliced set of face image paths for the game.
   */
  private getFacePathsBasedOnBoardSize(): string[] {
    const fullFacePaths = this.createThemeFacePathsCopy(this.theme.facePaths);
    const shuffledFacePaths: string[] = this.shuffleArray(fullFacePaths);
    const slicedFacePaths: string[] = shuffledFacePaths.slice(0, (this.boardSize.size / 2));
    return slicedFacePaths;
  }


  /**
   * Creates the full card set by duplicating each face path into a matching pair.
   *
   * @param facePaths The source face images used to generate the card pairs.
   * @returns The complete set of cards for the match.
   */
  private createCardSet(facePaths: string[]): Card[] {
    const cards: Card[] = [];
    let cardId: number = 0;
    facePaths.forEach((facePath, pairId) => {
      cardId = this.appendCardPair(cards, cardId, pairId, facePath);
    });
    return cards;
  }

  /**
   * Appends a pair of cards for one face path and returns the next available card id.
   *
   * @param cards The target card collection.
   * @param cardId The current card id counter.
   * @param pairId The pair id assigned to both generated cards.
   * @param facePath The image path used by both cards in the pair.
   * @returns The next available card id after appending the pair.
   */
  private appendCardPair(
    cards: Card[],
    cardId: number,
    pairId: number,
    facePath: string
  ): number {
    cards.push(this.createNewCard(cardId, pairId, facePath));
    cards.push(this.createNewCard(cardId + 1, pairId, facePath));
    return cardId + 2;
  }

  /**
   * Creates a new card model.
   *
   * @param cardId The unique id of the card.
   * @param pairId The shared pair id used to match duplicate cards.
   * @param facePath The image path shown on the front face of the card.
   * @returns The created card object.
   */
  private createNewCard(cardId: number, pairId: number, facePath: string): Card {
    return {
      id: cardId,
      pairId: pairId,
      facePath: facePath,
      isFlipped: false,
      isMatched: false
    };
  }

  /**
   * Shuffles an array in place using random index swaps.
   *
   * @param arr The array to shuffle.
   * @returns The same array instance after shuffling.
   */
  private shuffleArray<T>(arr: T[]): T[] {

    for (let currentIndex = arr.length - 1; currentIndex >= 0; currentIndex--) {
      const targetIndex = this.getRandomIndex(currentIndex);
      const targetTemp = arr[targetIndex];
      arr[targetIndex] = arr[currentIndex];
      arr[currentIndex] = targetTemp;
    }

    return arr;
  }

  /**
   * Creates a shallow copy of the theme face paths.
   *
   * @param facePaths The original array of theme face paths.
   * @returns A copied array containing the same face paths.
   */
  private createThemeFacePathsCopy(facePaths: string[]): string[] {
    let copyFacePaths: string[] = [];
    facePaths.forEach((path) => {
      copyFacePaths.push(path);
    });
    return copyFacePaths;
  }

  /**
   * Returns a random array index between `0` and the provided maximum index.
   *
   * @param currentIndex The inclusive upper bound for the random index.
   * @returns A random index within the allowed range.
   */
  private getRandomIndex(currentIndex: number): number {
    return Math.floor(Math.random() * (currentIndex + 1));
  }

}
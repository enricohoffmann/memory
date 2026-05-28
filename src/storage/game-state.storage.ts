import { GameState } from "../types/game.types";

/**
 * Persists and restores the game state using browser local storage.
 *
 * The storage wrapper handles serialization and deserialization and provides
 * convenience methods to read, write, and clear the stored game state.
 */
export class GameStateStorage {

  private gameState: GameState | null = null;
  private readonly STORAGE_KEY: string = "game_state";

  /**
   * Creates a new game state storage instance.
   */
  constructor() {
  }

  /**
   * Loads the game state from local storage and returns it.
   *
   * @returns The restored game state, or `null` if no state exists or parsing fails.
   */
  getGameState(): (GameState | null) {
    this.loadStateFromLocalStorage();
    return this.gameState;
  }

  /**
   * Stores the provided game state and persists it to local storage.
   *
   * @param gameState The game state to persist.
   * @returns The stored game state.
   */
  setGameState(gameState: GameState): GameState {
    this.gameState = gameState;
    this.saveStateToLocalStorage();
    return this.gameState;
  }

  /**
   * Clears the stored game state from local storage when an in-memory state exists.
   */
  clearGameState(): void {
    if(this.gameState){ this.clearStateInLocalStorage();}
  }

  /**
   * Reads and parses the persisted game state from local storage.
   */
  private loadStateFromLocalStorage(): void {
    try {
      const state = localStorage.getItem(this.STORAGE_KEY);
      this.gameState = state ? JSON.parse(state) : null;
    } catch {
      this.gameState = null;
    }
  }

  /**
   * Serializes and writes the current game state to local storage.
   */
  private saveStateToLocalStorage(): void {
    try {
      if (this.gameState) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.gameState));
      }
    } catch {}
  }

  /**
   * Clears persisted local storage entries.
   */
  private clearStateInLocalStorage(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch {}
  }
}
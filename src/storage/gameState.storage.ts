import { GameState } from "../types/game.types";

export class GameStateStorage {

    private gameState: GameState | null = null;
    private readonly STORAGE_KEY: string = "game_state";

    constructor() {
    }

    getGameState(): (GameState | null) {
        this.loadStateFromLocalStorage();
        return this.gameState;
    }

    setGameState(gameState: GameState): GameState {
        this.gameState = gameState;
        this.saveStateToLocalStorage();
        return this.gameState;
    }

    clearGameState(): void {
        if(this.gameState){ this.clearGameState();}
    }

    private loadStateFromLocalStorage(): void {
        try {
            const state = localStorage.getItem(this.STORAGE_KEY);
            this.gameState = state ? JSON.parse(state) : null;
        } catch {
            this.gameState = null;
        }
    }

    private saveStateToLocalStorage(): void {
        try {
            if (this.gameState) {
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.gameState));
            }
        } catch {
            
        }
    }

    private clearStateInLocalStorage(): void {
        try {
            localStorage.clear();
        } catch {}
    }
}
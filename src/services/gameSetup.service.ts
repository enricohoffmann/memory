import { GameService } from "./game.service";
import { BoardSize, GameConfig, GameConfigValidationResult, GameState, Player, Theme } from "../types/game.types";


/**
 * Validates game setup input and creates the initial game state when configuration is valid.
 *
 * The service checks player selection, theme selection, and board size selection,
 * then returns either validation errors or a ready-to-play game state.
 */
export class GameSetupService {

    /**
     * Creates a new game setup service instance.
     */
    constructor() { }

    /**
     * Validates the provided game configuration and builds a game state on success.
     *
     * @param gameConfig The selected game configuration from the settings flow.
     * @param themes The available themes used to validate the selected theme.
     * @returns A validation result with errors or the initialized game state.
     */
    setupGame(gameConfig: GameConfig, themes: Theme[]): GameConfigValidationResult {
        const isPlayerSelectValid = this.validatePlayerConfig(gameConfig.selectedStartPlayerId, gameConfig.players);
        const isThemeValid = this.validateTheme(gameConfig.selectedTheme, themes);
        const isBoardSizeValid = this.validateBoardSize(gameConfig.selectedBoardSize);

        let errors: string[] = this.createValidationErrors(isThemeValid, isBoardSizeValid, isPlayerSelectValid);

        const result: GameConfigValidationResult = {
            success: errors.length === 0,
            errors: errors,
            gameState: errors.length === 0 ? this.buildGameStateFromConfig(gameConfig) : null
        }

        return result;

    }

    /**
     * Validates whether the selected start player id exists in the configured player list.
     *
     * @param playerId The selected start player id.
     * @param players The available players in the configuration.
     * @returns `true` when the player id is valid, otherwise `false`.
     */
    private validatePlayerConfig(playerId: string, players:Player[]): boolean {
        if(playerId.length === 0 || playerId === 'player-00') {return false;}
        const player = players.find(p => p.id === playerId);
        return player ? true : false;
    }

    /**
     * Validates whether the selected theme exists in the available themes.
     *
     * @param theme The selected theme.
     * @param themes The available themes.
     * @returns `true` when the theme is valid, otherwise `false`.
     */
    private validateTheme(theme: Theme, themes: Theme[]): boolean {
        if (!theme) { return false; }
        const themeCheck = themes.find(t => t.key === theme.key);
        return themeCheck ? true : false;
    }

    /**
     * Validates whether a board size has been selected.
     *
     * @param boardSize The selected board size.
     * @returns `true` when a board size exists, otherwise `false`.
     */
    private validateBoardSize(boardSize: BoardSize): boolean {
        return boardSize ? true : false;
    }

    /**
     * Builds the validation error messages for invalid setup selections.
     *
     * @param isThemeValid Whether the selected theme is valid.
     * @param isBoardSizeValid Whether the selected board size is valid.
     * @param isPlayerSelectValid Whether the selected start player is valid.
     * @returns The list of validation error messages.
     */
    private createValidationErrors(isThemeValid: boolean, isBoardSizeValid: boolean, isPlayerSelectValid: boolean): string[] {
        const errors: string[] = [];
        if (!isThemeValid) { errors.push('You haven\'t chosen a theme.'); }
        if (!isBoardSizeValid) { errors.push('You haven\'t selected a board size.'); }
        if (!isPlayerSelectValid) { errors.push('You haven\'t selected a player.'); }
        return errors;
    }

    /**
     * Creates a new game state from a valid game configuration.
     *
     * @param gameConfig The validated game configuration.
     * @returns The initialized game state.
     */
    private buildGameStateFromConfig(gameConfig: GameConfig): GameState {
        const gameService = new GameService(gameConfig);
        const state = gameService.initGame();
        return state;
    }


}
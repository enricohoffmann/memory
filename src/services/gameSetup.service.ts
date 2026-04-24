import { GameService } from "./game.service";
import { BoardSize, GameConfig, GameConfigValidationResult, GameState, Player, Theme } from "../types/game.types";


export class GameSetupService {

    constructor() { }

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

    private validatePlayerConfig(playerId: string, players:Player[]): boolean {
        if(playerId.length === 0 || playerId === 'player-00') {return false;}
        const player = players.find(p => p.id === playerId);
        return player ? true : false;
    }

    private validateTheme(theme: Theme, themes: Theme[]): boolean {
        if (!theme) { return false; }
        const themeCheck = themes.find(t => t.key === theme.key);
        return themeCheck ? true : false;
    }

    private validateBoardSize(boardSize: BoardSize): boolean {
        return boardSize ? true : false;
    }

    private createValidationErrors(isThemeValid: boolean, isBoardSizeValid: boolean, isPlayerSelectValid: boolean): string[] {
        const errors: string[] = [];
        if (!isThemeValid) { errors.push('You haven\'t chosen a theme.'); }
        if (!isBoardSizeValid) { errors.push('You haven\'t selected a board size.'); }
        if (!isPlayerSelectValid) { errors.push('You haven\'t selected a player.'); }
        return errors;
    }

    private buildGameStateFromConfig(gameConfig: GameConfig): GameState {
        const gameService = new GameService(gameConfig);
        const state = gameService.initGame();

        console.log(state);

        return state;

    }


}
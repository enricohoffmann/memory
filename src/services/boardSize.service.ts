import { BoardSize, Size } from "../types/game.types";


/**
 * Provides the available board size configurations for the game.
 *
 * The service exposes predefined board sizes and helper methods to retrieve them
 * either as a full list or by their identifier.
 */
export class BoardSizeService {
    private readonly boardSizes:BoardSize[] = [
        {id: String(16), name: this.getBoardSizeName(16), size: 16, rows:4, columns: 4},
        {id: String(24), name: this.getBoardSizeName(24), size: 24, rows:4, columns: 6},
        {id: String(36), name: this.getBoardSizeName(36), size: 36, rows:6, columns: 6},
    ];

    /**
     * Creates a new board size service instance.
     */
    constructor() {}

    /**
     * Returns all available board size configurations.
     *
     * @returns The predefined list of selectable board sizes.
     */
    getBoardSizes():BoardSize[]{
        return this.boardSizes;
    }

    /**
     * Returns the board size configuration that matches the provided id.
     *
     * @param boardSizeId The identifier of the requested board size.
     * @returns The matching board size, or `null` when no configuration exists for the id.
     */
    getBoardSizeById(boardSizeId: string):(BoardSize | null) {
        const boardSize = this.boardSizes.find(b => b.id === boardSizeId);
        return boardSize ? boardSize : null;
    }

    /**
     * Creates the display name for a board size.
     *
     * @param size The number of cards on the board.
     * @returns The generated display label for the board size.
     */
    private getBoardSizeName(size: Size):string {
        return `${size} cards`;
    }
    
}
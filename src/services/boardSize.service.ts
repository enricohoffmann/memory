import { BoardSize, Size } from "../types/game.types";


export class BoardSizeService {
    private readonly boardSizes:BoardSize[] = [
        {id: String(16), name: this.getBoardSizeName(16), size: 16, rows:4, columns: 4},
        {id: String(24), name: this.getBoardSizeName(24), size: 24, rows:4, columns: 6},
        {id: String(36), name: this.getBoardSizeName(36), size: 36, rows:6, columns: 6},
    ];

    constructor() {}

    getBoardSizes():BoardSize[]{
        return this.boardSizes;
    }

    private getBoardSizeName(size: Size):string {
        return `${size} cards`;
    }
    
}
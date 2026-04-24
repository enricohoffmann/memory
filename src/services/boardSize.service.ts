import { BoardSize } from "../types/game.types";


export class BoardSizeService {
    private readonly boardSizes:BoardSize[] = [
        {size: 16, rows:4, columns: 4},
        {size: 24, rows:4, columns: 6},
        {size: 36, rows:6, columns: 6},
    ];

    constructor() {}

    getBoardSizes():BoardSize[]{
        return this.boardSizes;
    }
    
}
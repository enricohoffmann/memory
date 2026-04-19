export interface Player {
    id:number;
    name:string;
    color:string;
    score:number;
}

export interface Card {
    id:number;
    pairId:number;
    frontFace:string;
    isFlipped:boolean;
    isMatched:boolean;
}

export interface BoardSize {
    size: 16 | 24 | 32;
    rows:number;
    columns:number;
}

export type GameStatus = 'idle' | 'running' | 'lost' | 'won';

export interface GameState {
    players: Player[],
    currentPlayerId:number,
    cards:Card[],
    selectedCards:number[],
    theme:number, //ToDo muss noch erstellt werden.
    boardSize:BoardSize,
    status:GameStatus
}
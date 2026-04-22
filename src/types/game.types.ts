export type ThemeKey = 'code-vibes' | 'games' | 'da-projects' | 'food';
export type GameStatus = 'idle' | 'running' | 'lost' | 'won';

export interface Player {
    id:number;
    name:string;
    color:string;
    score:number;
}

export interface Card {
    id:number;
    pairId:number;
    facePath:string;
    isFlipped:boolean;
    isMatched:boolean;
}

export interface BoardSize {
    size: 16 | 24 | 36;
    rows:number;
    columns:number;
}
export interface GameState {
    players: Player[];
    currentPlayerId:number;
    cards:Card[];
    selectedCards:number[];
    themeKey:ThemeKey;
    boardSize:BoardSize;
    status:GameStatus;
}

export interface Theme {
    key:ThemeKey;
    name:string;
    facePaths:string[];
}
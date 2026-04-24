export type ThemeKey = 'code-vibes' | 'games' | 'da-projects' | 'food';
export type GameStatus = 'idle' | 'running' | 'lost' | 'won';
export type ViewName = 'home' | 'settings' | 'play' | 'game-over' | 'winner';

export interface Player {
    id:string;
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
    currentPlayerId:string;
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

export interface GameConfig {
    selectedTheme: Theme;
    players: Player[];
    selectedStartPlayerId: string;
    selectedBoardSize: BoardSize;
}

export interface GameConfigValidationResult {
    success:boolean;
    errors:string[];
    gameState:GameState | null
}
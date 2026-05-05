import { SettingOptionGroupComponent } from "../components/settingOptionGroup.component";

export type ThemeKey = 'code-vibes' | 'games' | 'da-projects' | 'food';
export type GameStatus = 'idle' | 'running' | 'lost' | 'won';
export type ViewName = 'home' | 'settings' | 'play' | 'game-over' | 'winner';
export type Size = 16 | 24 | 36;


export interface SettingOption {
    id: string;
    name: string;
}

export interface Player extends SettingOption {
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

export interface BoardSize extends SettingOption {
    size: Size;
    rows:number;
    columns:number;
}
export interface GameState {
    players: Player[];
    startPlayerId:string;
    currentPlayerId:string;
    cards:Card[];
    selectedCards:number[];
    themeKey:ThemeKey;
    boardSize:BoardSize;
    status:GameStatus;
}

export interface Theme extends SettingOption {
    key:ThemeKey;
    facePaths:string[];
    selectionText:string;
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

export interface SettingButtonParamter {
    buttonId:string;
    buttonText:string;
    isInitialActive:boolean;
    onClicked?: (buttonId: string) => void;
}

export interface OptionGroupSpecification<T> {
    title: string;
    firstElementIsActive:boolean;
    nodeName: string;
    iconPath: string;
    groupComponent: SettingOptionGroupComponent;
    groupArray: T[];
}

export interface AssetFile {
    key: string;
    url: string;
}
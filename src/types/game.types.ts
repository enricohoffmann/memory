import { CardComponent } from "../components/card.Component";
import { SettingOptionGroupComponent } from "../components/settingOptionGroup.component";

export type ThemeKey = 'code-vibes' | 'games' | 'da-projects' | 'food';
export type GameStatus = 'idle' | 'running' | 'over' | 'won' | 'draw';
export type ViewName = 'home' | 'settings' | 'play' | 'game-over' | 'winner';
export type Size = 16 | 24 | 36;
export type ButtonVariant = 'homePlay-btn' | 'setting-btn' | 'exit-btn' | 'win-draw-btn' | 'popup-exit' | 'popup-resume'; 
export type ScoreBoardVariant = 'play' | 'game-over';
export type TrophyType = 'winner' | 'draw';


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
    matchedCards:number[];
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
    optionName: string;
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

export interface CompareCardsResult {
    result: 'successfully' | 'unsuccessful' | 'failed' | 'gameOver';
    cardsToTurnBack?: CardComponent[];
}

export interface GameOverResult {
    gameStatus: GameStatus;
    winner: Player;
}

export interface ButtonConfig {
    variant: ButtonVariant;
    theme?: ThemeKey;
    text?: string;
    hasIcon?: boolean;
    disabled?: boolean;
}

export interface DialogButtonMessages {
    theme: ThemeKey;
    resumeText: string;
    exitText: string;
}
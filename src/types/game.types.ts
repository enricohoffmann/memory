import { CardComponent } from "../components/card.component";
import { SettingOptionGroupComponent } from "../components/setting-option-group.component";

/** Available visual theme keys. */
export type ThemeKey = 'code-vibes' | 'games' | 'da-projects' | 'food';

/** Runtime status of the game lifecycle. */
export type GameStatus = 'idle' | 'running' | 'over' | 'won' | 'draw';

/** Supported top-level application views. */
export type ViewName = 'home' | 'settings' | 'play' | 'game-over' | 'winner';

/** Supported board card counts. */
export type Size = 16 | 24 | 36;

/** Visual button variants used across the UI. */
export type ButtonVariant = 'homePlay-btn' | 'setting-btn' | 'exit-btn' | 'win-draw-btn' | 'popup-exit' | 'popup-resume'; 

/** Scoreboard render variants. */
export type ScoreBoardVariant = 'play' | 'game-over';

/** Trophy result variants shown on end screens. */
export type TrophyType = 'winner' | 'draw';


/** Shared base shape for selectable setting options. */
export interface SettingOption {
  id: string;
  name: string;
}

/** Player definition used in game setup and gameplay state. */
export interface Player extends SettingOption {
  color:string;
  score:number;
}

/** Card model used by the memory board. */
export interface Card {
  id:number;
  pairId:number;
  facePath:string;
  isFlipped:boolean;
  isMatched:boolean;
}

/** Board layout configuration. */
export interface BoardSize extends SettingOption {
  size: Size;
  rows:number;
  columns:number;
}

/** Complete mutable game state persisted during gameplay. */
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

/** Theme configuration and linked face assets. */
export interface Theme extends SettingOption {
  key:ThemeKey;
  facePaths:string[];
  selectionText:string;
}

/** Game setup payload selected in the settings view. */
export interface GameConfig {
  selectedTheme: Theme;
  players: Player[];
  selectedStartPlayerId: string;
  selectedBoardSize: BoardSize;
}

/** Result of game setup validation with optional ready game state. */
export interface GameConfigValidationResult {
  success:boolean;
  errors:string[];
  gameState:GameState | null
}

/** Parameter object used to build a radial setting button. */
export interface SettingButtonParameter {
  buttonId:string;
  buttonText:string;
  isInitialActive:boolean;
  onClicked?: (buttonId: string) => void;
  onHovered?: (buttonId: string) => void;
  onLeave?: () => void;
}

/** Specification for rendering one setting option group. */
export interface OptionGroupSpecification<T> {
  optionName: string;
  title: string;
  firstElementIsActive:boolean;
  nodeName: string;
  iconPath: string;
  groupComponent: SettingOptionGroupComponent;
  groupArray: T[];
}

/** Loaded asset file reference with source key and resolved URL. */
export interface AssetFile {
  key: string;
  url: string;
}

/** Result object returned after comparing two selected cards. */
export interface CompareCardsResult {
  result: 'successfully' | 'unsuccessful' | 'failed' | 'gameOver';
  cardsToTurnBack?: CardComponent[];
}

/** Final game result for winner/draw presentation. */
export interface GameOverResult {
  gameStatus: GameStatus;
  winner: Player;
}

/** Configuration used to build reusable button components. */
export interface ButtonConfig {
  variant: ButtonVariant;
  theme?: ThemeKey;
  text?: string;
  hasIcon?: boolean;
  disabled?: boolean;
}

/** Theme-specific labels used by the exit dialog buttons. */
export interface DialogButtonMessages {
  theme: ThemeKey;
  resumeText: string;
  exitText: string;
}
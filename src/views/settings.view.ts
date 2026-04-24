import { BoardSizeService } from "../services/boardSize.service";
import { PlayerService } from "../services/player.service";
import { ThemeService } from "../services/theme.service";
import { BoardSize, Player, Theme, ViewName } from "../types/game.types";


export class SettingsView {

    private themes: Theme[] = [];
    private players: Player[] = [];
    private boardSizes: BoardSize[] = [];
    private selectedStartPlayerId: string = 'player-00';
    private themeService: ThemeService;
    private playerService: PlayerService;
    private boardSizeService: BoardSizeService;

    constructor(private navigate: (view: ViewName) => void) {
        this.themeService = new ThemeService();
        this.playerService = new PlayerService();
        this.boardSizeService = new BoardSizeService();
    }

    onInit() {
        this.loadThemes();
        this.loadPlayers();
        this.loadBoardSizes();
        this.selectedStartPlayerId = 'player-00';
    }

    private loadThemes() {
        this.themeService.init();
        this.themes = this.themeService.getThemes();
    }

    private loadPlayers() {
        this.players = this.playerService.getPlayers();
    }

    private loadBoardSizes() {
        this.boardSizes = this.boardSizeService.getBoardSizes();
    }


    render(container: HTMLElement) {
        this.renderSettingsSection(container);
    }


    private renderSettingsSection(container: HTMLElement) {
        container.innerHTML = `
            <section class='settings-section'>
                <h2>Settings</h2>
            </section>
            `;
    }


}
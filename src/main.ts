import { GameService } from './services/game.service';
import { ThemeService } from './services/theme.service';
import './styles/main.scss';
import { BoardSize, Player, ThemeKey } from './types/game.types';


let players:Player[] = [];

players.push({
    id:1,
    name:'orange',
    color:'orange',
    score:0
});

//console.log(players);


players.push({
    id:2,
    name:'blue',
    color:'blue',
    score:0
});

const bSize:BoardSize = {
    size: 24,
    rows:4,
    columns:4
};

const tKey:ThemeKey = 'games';

const themeService = new ThemeService();
themeService.init();
const theme = themeService.getThemeByThemeKey(tKey);
if(theme) {
    const gameService = new GameService(players, theme, bSize);
    const state = gameService.initGame();
    console.log(state);
}


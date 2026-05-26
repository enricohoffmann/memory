import { NavigationManager } from "./manager/navigation.manager";
import { GameStateStorage } from "./storage/gameState.storage";
import './styles/main.scss';
import { GameState } from "./types/game.types";

const app = document.getElementById('app');
const gameStorage:GameStateStorage = new GameStateStorage();

if(app){
    const navigation = new NavigationManager(app);
    const gameState: GameState | null = gameStorage.getGameState();

    if(gameState && gameState.status === 'running'){
        navigation.navigateTo('play', gameState);
    } else {
        navigation.navigateTo('home');
    }

}





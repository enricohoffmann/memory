import { NavigationManager } from "./manager/navigation.manager";
import { GameStateStorage } from "./storage/gameState.storage";
import './styles/main.scss';
import { GameState } from "./types/game.types";

const app = document.getElementById('app');
const gameStorage:GameStateStorage = new GameStateStorage();

/**
 * Bootstraps the application and routes to the initial view.
 *
 * The app resumes an existing running game when present, otherwise
 * it starts from the home view.
 */
function bootstrapApp(): void {
    if(!app){
        return;
    }
    const navigation = new NavigationManager(app);
    const gameState: GameState | null = gameStorage.getGameState();

    if(gameState && gameState.status === 'running'){
        navigation.navigateTo('play', gameState);
    } else {
        navigation.navigateTo('home');
    }
}

bootstrapApp();





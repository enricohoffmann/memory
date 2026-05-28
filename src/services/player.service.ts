import { Player } from "../types/game.types";



/**
 * Provides access to the predefined players used in the game setup.
 *
 * The service exposes helper methods to retrieve all players or look up
 * a single player by id.
 */
export class PlayerService {
    /**
     * Creates a new player service instance.
     */
    constructor() {

    }

    private readonly players: Player[] = [
        { id: 'player-01', name: 'Blue', color: 'blue', score: 0 },
        { id: 'player-02', name: 'Orange', color: 'orange', score: 0 }
    ];


    /**
     * Returns the predefined list of players.
     *
     * @returns The available players.
     */
    getPlayers(): Player[] {
        return this.players;
    }

    /**
     * Returns the player that matches the provided id.
     *
     * @param playerId The id of the requested player.
     * @returns The matching player, or `null` when no player is found.
     */
    getPlayerById(playerId: string): (Player | null) {
        const player = this.players.find(p => p.id === playerId);
        return player ? player : null; 
    }

    
}
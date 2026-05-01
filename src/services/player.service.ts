import { Player } from "../types/game.types";



export class PlayerService {
    constructor() {

    }

    private readonly players: Player[] = [
        { id: 'player-01', name: 'Blue', color: 'blue', score: 0 },
        { id: 'player-02', name: 'Orange', color: 'orange', score: 0 }
    ];


    getPlayers(): Player[] {
        return this.players;
    }

    getPlayerById(playerId: string): (Player | null) {
        const player = this.players.find(p => p.id === playerId);
        return player ? player : null; 
    }

    
}
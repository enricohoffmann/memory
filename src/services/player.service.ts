import { Player } from "../types/game.types";


export class PlayerService {
    constructor(){}

    private readonly players:Player[] = [
        {
            id:'player-01',
            name: 'Blue',
            color: 'blue',
            score: 0,
            isSelected: false
        },
        {
            id:'player-02',
            name: 'Orange',
            color: 'orange',
            score: 0,
            isSelected: false
        }
    ];



    getPlayers():Player[]{
        return this.players;
    }
}
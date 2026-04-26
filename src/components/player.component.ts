import { Player } from "../types/game.types";
import { RadialButton } from "./radialButton.component";

export class PlayerComponent {

    _players:Player[] = [];

    constructor(){
    }

    onInit(players:Player[]){
        this._players = players;
    }

    getPlayersHtml(): string{

        let playercontainerHtml = '';

        this._players.forEach((player) => {

            const radialButton:RadialButton = new RadialButton();
            playercontainerHtml += radialButton.getRadialButton(player.name, player.id)


        });

        return playercontainerHtml;
    }
}
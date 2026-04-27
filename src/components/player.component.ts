import { Player, SettingButtonParamter } from "../types/game.types";
import { RadialButton } from "./radialButton.component";

export class PlayerComponent {

    _players: Player[] = [];


    constructor() {
    }

    onInit(players: Player[]) {
        this._players = players;
    }

    getPlayers(container: HTMLElement): HTMLElement {


        this._players.forEach((player) => {

            const buttonParams: SettingButtonParamter = {
                buttonId: player.id,
                buttonText: player.name,
                isInitialActive: false,
                onClicked: (playerId) => {
                    this.onPlayerSelected(playerId)
                }
            };

            const radialButton: RadialButton = new RadialButton(buttonParams);
            container.appendChild(radialButton.getRadialButton());


        });

        return container;
    }

    onPlayerSelected(playerId: string) {

        const selectedPlayer = this._players.find(p => p.id === playerId);

        if (!selectedPlayer) { return; }

        selectedPlayer.isSelected = !selectedPlayer.isSelected;

        this._players.forEach((player) => {

            if (player.id != playerId) {
                player.isSelected = !selectedPlayer.isSelected;
            }
        });

        console.log(this._players);
        
    }

}
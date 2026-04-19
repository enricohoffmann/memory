import { Player, ThemeKey, Card, BoardSize } from "../types/game.types";


export class GameService {

    private players:Player[];
    private themeKey:ThemeKey;
    private boardSize:BoardSize;
    private cards:Card[] = [];

    constructor(players:Player[], themeKey:ThemeKey, boardSize:BoardSize){
        this.themeKey = themeKey;
        this.players = players;
        this.boardSize = boardSize;
    }

    private getFaceKeysByThemeKey(){
        //return ein Array alles FaceKeys as dem ThemeService zu dem ThemeKey
    }

    private createAsingleCardSet(faceKeys:[]){
        //mit forschleife ein Array mit den Cards erstellen
    }

    private shuffleTheCards(singleCards:Card[]){
        //FaceKeys verdopplen
        //Mischen
        //Ein Array mit den gemischten / verdoppelten FaceKeys zurückgeben
    }





}
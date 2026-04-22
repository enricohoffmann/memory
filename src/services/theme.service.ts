import { Theme, ThemeKey } from "../types/game.types";

export class ThemeService {

    private themes: Theme[] = [];

    constructor() {}

    init(){
        if(this.themes.length === 0){
            this.initThemeArray();
            const assetFileNames:string[] = this.loadAssetFileNames();
            this.sortAssetFileNamesIntoThemes(assetFileNames);
        }
    }

    private initThemeArray(){
        this.themes.push({key: 'code-vibes', name: 'Coding vibes theme', facePaths: []});
        this.themes.push({key: 'da-projects', name: 'DA Projects theme', facePaths: []});
        this.themes.push({key: 'food', name: 'Food theme', facePaths: []});
        this.themes.push({key: 'games', name: 'Gaming theme', facePaths: []});
    }

    getThemes(): Theme[]{
        return this.themes;
    }

    getThemeByThemeKey(key:ThemeKey):(Theme | null) {
        const theme = this.themes.find(t => t.key === key);
        return theme ? theme : null;
    }


    private loadAssetFileNames():string[] {
        let assetFiles = import.meta.glob<{ default: string }>('../assets/icons/*/*.svg');
        let assetFileNames:string[] = [];

        Object.keys(assetFiles).forEach((fileName) => {
            assetFileNames.push(fileName);
        });

        return assetFileNames;

    }

    private sortAssetFileNamesIntoThemes(assetFileNames:string[]):void {
        this.themes.forEach((theme) => {
            const themeFileNames = assetFileNames.filter(n => n.startsWith(`../assets/icons/${theme.key}/`));
            theme.facePaths = themeFileNames;
        });
    }


    


}
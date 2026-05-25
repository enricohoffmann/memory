import { AssetFile, Theme, ThemeKey } from "../types/game.types";

export class ThemeService {

    private themes: Theme[] = [];
    private previewFiles = import.meta.glob<{ default: string}>('../assets/images/theme-visual/*.svg', {
        eager: true,       
        import: 'default'
    });


    constructor() {}

    init(){
        if(this.themes.length === 0){
            this.initThemeArray();
            const assetFiles:AssetFile[] = this.loadAssetFileNames();
            this.sortAssetFileNamesIntoThemes(assetFiles);
        }
    }

    private initThemeArray(){

        this.themes.push({id:'theme-01', key: 'code-vibes', name: 'Coding vibes theme', facePaths: [], selectionText: 'Coding Theme'});
        this.themes.push({id:'theme-02', key: 'da-projects', name: 'DA Projects theme', facePaths: [], selectionText: 'DA Projects Theme'});
        this.themes.push({id:'theme-03', key: 'food', name: 'Food theme', facePaths: [], selectionText: 'Food Theme'});
        this.themes.push({id:'theme-04', key: 'games', name: 'Gaming theme', facePaths: [], selectionText: 'Game Theme'});
    }


    getThemes(): Theme[]{
        return this.themes;
    }

    getThemeImageById(themeId: string): string {
        const theme = this.themes.find(t => t.id === themeId);
        if(!theme) {return '';}
        const imageKey = `../assets/images/theme-visual/${theme.key}-preview.svg`;
        return String(this.previewFiles[imageKey]);
    }

    getThemeById(themeId: string): (Theme | null) {
        const theme = this.themes.find(t => t.id === themeId);
        return theme ? theme : null;
    }

    getThemeIdByThemeKey(themeKey: ThemeKey): string {
        const theme = this.themes.find(t => t.key === themeKey);
        return theme ? theme.id : '';
    }

    private loadAssetFileNames():AssetFile[] {
        let assetFiles = import.meta.glob<{ default: string }>('../assets/icons/*/*.svg', {
            eager: true,
            import: 'default'
        });

        const assetFileNames:AssetFile[] = [];

        Object.keys(assetFiles).forEach((fileName) => {

            const assetFile:AssetFile = {
                key: fileName,
                url: String(assetFiles[fileName])
            }

            assetFileNames.push(assetFile);
        });

        return assetFileNames;

    }

    private sortAssetFileNamesIntoThemes(assetFiles:AssetFile[]):void {
        this.themes.forEach((theme) => {
            const themeFileNames = assetFiles.filter(n => n.key.startsWith(`../assets/icons/${theme.key}/`));
            theme.facePaths = themeFileNames.map(f => f.url);
        });
    }


    


}
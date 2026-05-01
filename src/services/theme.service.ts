import { Theme, ThemeKey } from "../types/game.types";

export class ThemeService {

    private themes: Theme[] = [];
    private previewFiles = import.meta.glob<{ default: string}>('../assets/images/theme-visual/*.svg', {
        eager: true,       
        import: 'default'
    });


    constructor() {}

    init(){
        if(this.themes.length === 0){
            //const previewFileNames: string[] = this.loadPreviewImageFileNames();
            this.initThemeArray();
            const assetFileNames:string[] = this.loadAssetFileNames();
            this.sortAssetFileNamesIntoThemes(assetFileNames);
        }
    }

    private initThemeArray(){

        this.themes.push({id:'theme-01', key: 'code-vibes', name: 'Coding vibes theme', facePaths: []});
        this.themes.push({id:'theme-02', key: 'da-projects', name: 'DA Projects theme', facePaths: []});
        this.themes.push({id:'theme-03', key: 'food', name: 'Food theme', facePaths: []});
        this.themes.push({id:'theme-04', key: 'games', name: 'Gaming theme', facePaths: []});
    }

    private getThemePreviewImageFileName(previewFileNames: string[], themeKey: ThemeKey): string {
        const fileName = previewFileNames.filter(n => n.startsWith(`../assets/images/theme-visual/${themeKey}`));
        return fileName.length > 0 ? fileName[0] : "";
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


    private loadAssetFileNames():string[] {
        let assetFiles = import.meta.glob<{ default: string }>('../assets/icons/*/*.svg');
        let assetFileNames:string[] = [];

        Object.keys(assetFiles).forEach((fileName) => {
            assetFileNames.push(fileName);
        });

        return assetFileNames;

    }

    /* private loadPreviewImageFileNames():string[]{
        let previewFiles = import.meta.glob<{ default: string}>('../assets/images/theme-visual/*.svg');
        let previewFileNames: string[] = [];

        console.log(previewFiles);
        

        Object.keys(previewFiles).forEach((fileName) => {
            previewFileNames.push(fileName);
        });

        return previewFileNames;
    } */

    private sortAssetFileNamesIntoThemes(assetFileNames:string[]):void {
        this.themes.forEach((theme) => {
            const themeFileNames = assetFileNames.filter(n => n.startsWith(`../assets/icons/${theme.key}/`));
            theme.facePaths = themeFileNames;
        });
    }


    


}
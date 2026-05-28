import { AssetFile, Theme, ThemeKey } from "../types/game.types";

/**
 * Manages available themes and resolves their preview and card face assets.
 *
 * The service initializes the theme list once, loads matching asset file paths,
 * and provides lookup helpers by theme id and key.
 */
export class ThemeService {

  private themes: Theme[] = [];
  private previewFiles = import.meta.glob<{ default: string}>('../assets/images/theme-visual/*.svg', {
    eager: true,       
    import: 'default'
  });


  /**
   * Creates a new theme service instance.
   */
  constructor() {}

  /**
   * Initializes the theme list and assigns icon face paths once.
   */
  init(): void{
    if(this.themes.length === 0){
      this.initThemeArray();
      const assetFiles:AssetFile[] = this.loadAssetFileNames();
      this.sortAssetFileNamesIntoThemes(assetFiles);
    }
  }

  /**
   * Creates the default list of selectable themes.
   */
  private initThemeArray(): void{

    this.themes.push({id:'theme-01', key: 'code-vibes', name: 'Coding vibes theme', facePaths: [], selectionText: 'Coding Theme'});
    this.themes.push({id:'theme-02', key: 'da-projects', name: 'DA Projects theme', facePaths: [], selectionText: 'DA Projects Theme'});
    this.themes.push({id:'theme-03', key: 'food', name: 'Food theme', facePaths: [], selectionText: 'Food Theme'});
    this.themes.push({id:'theme-04', key: 'games', name: 'Gaming theme', facePaths: [], selectionText: 'Game Theme'});
  }


  /**
   * Returns all initialized themes.
   *
   * @returns The current theme collection.
   */
  getThemes(): Theme[]{
    return this.themes;
  }

  /**
   * Returns the preview image URL for the theme with the provided id.
   *
   * @param themeId The id of the requested theme.
   * @returns The preview image URL, or an empty string if the theme is unknown.
   */
  getThemeImageById(themeId: string): string {
    const theme = this.themes.find(t => t.id === themeId);
    if(!theme) {return '';}
    const imageKey = `../assets/images/theme-visual/${theme.key}-preview.svg`;
    return String(this.previewFiles[imageKey]);
  }

  /**
   * Returns the theme that matches the provided id.
   *
   * @param themeId The id of the requested theme.
   * @returns The matching theme, or `null` if no theme is found.
   */
  getThemeById(themeId: string): (Theme | null) {
    const theme = this.themes.find(t => t.id === themeId);
    return theme ? theme : null;
  }

  /**
   * Returns the theme id for the provided theme key.
   *
   * @param themeKey The key of the requested theme.
   * @returns The matching theme id, or an empty string when not found.
   */
  getThemeIdByThemeKey(themeKey: ThemeKey): string {
    const theme = this.themes.find(t => t.key === themeKey);
    return theme ? theme.id : '';
  }

  /**
   * Loads all icon asset files and returns their source keys and resolved URLs.
   *
   * @returns The list of discovered asset files.
   */
  private loadAssetFileNames():AssetFile[] {
    const assetFiles: Record<string, { default: string }> = this.loadIconAssetFiles();
    return this.mapAssetFiles(assetFiles);
  }

  /**
   * Loads all icon asset modules as a flat path-to-url map.
   *
   * @returns The resolved icon asset map.
   */
  private loadIconAssetFiles(): Record<string, { default: string }> {
    return import.meta.glob<{ default: string }>('../assets/icons/*/*.svg', {
      eager: true,
      import: 'default'
    });
  }

  /**
   * Converts a path-to-url map into the asset file structure used by the service.
   *
   * @param assetFiles The loaded icon asset map.
   * @returns The mapped asset files.
   */
  private mapAssetFiles(assetFiles: Record<string, { default: string }>): AssetFile[] {
    const assetFileNames: AssetFile[] = [];

    Object.keys(assetFiles).forEach((fileName) => {
      assetFileNames.push({
        key: fileName,
        url: assetFiles[fileName].default
      });
    });

    return assetFileNames;
  }

  /**
   * Assigns each theme its face image URLs based on matching asset file paths.
   *
   * @param assetFiles The loaded icon asset files.
   */
  private sortAssetFileNamesIntoThemes(assetFiles:AssetFile[]):void {
    this.themes.forEach((theme) => {
      const themeFileNames = assetFiles.filter(n => n.key.startsWith(`../assets/icons/${theme.key}/`));
      theme.facePaths = themeFileNames.map(f => f.url);
    });
  }


  


}
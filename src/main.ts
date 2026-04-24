import { NavigationManager } from "./manager/navigation.manager";

const app = document.getElementById('app');

if(app){
    const navigation = new NavigationManager(app);
    navigation.navigateTo('settings');
}

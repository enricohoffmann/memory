import { NavigationManager } from "./manager/navigation.manager";
import './styles/main.scss';

const app = document.getElementById('app');

if(app){
    const navigation = new NavigationManager(app);
    navigation.navigateTo('settings');
}

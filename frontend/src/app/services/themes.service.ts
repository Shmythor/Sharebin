import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemesService {
    constructor() { }

    public switchTheme(newTheme: string) {
        (document.getElementById('currentTheme') as HTMLLinkElement).href = `./assets/themes/${newTheme}.css`;

        if (newTheme !== 'winter') {
            (document.getElementById('navbar-icon-home') as HTMLImageElement).src = '../../../assets/icons/home.svg';
            (document.getElementById('navbar-icon-bin') as HTMLImageElement).src = '../../../assets/icons/bin.svg';
            (document.getElementById('navbar-icon-themes') as HTMLImageElement).src = '../../../assets/icons/themes.svg';
            (document.getElementById('navbar-logo') as HTMLImageElement).src = '../../../assets/logo-light.png';
        } else {
            (document.getElementById('navbar-icon-home') as HTMLImageElement).src = '../../../assets/icons/home-black.svg';
            (document.getElementById('navbar-icon-bin') as HTMLImageElement).src = '../../../assets/icons/bin-black.svg';
            (document.getElementById('navbar-icon-themes') as HTMLImageElement).src = '../../../assets/icons/themes-black.svg';
            (document.getElementById('navbar-logo') as HTMLImageElement).src = '../../../assets/logo.png';
        }

        localStorage.setItem('currentTheme', newTheme);
    }

    public switchLoginTheme(newTheme: string) {
        newTheme === 'dark' ?
            (document.getElementById('login-logo') as HTMLImageElement).src = '../../../assets/logo-light.png' :
            (document.getElementById('login-logo') as HTMLImageElement).src = '../../../assets/logo.png';
    }

    public getStoredTheme(): string {
        return localStorage.getItem('currentTheme');
    }

    public refreshTheme(fromHome: boolean) {
        const theme = this.getStoredTheme();

        if (theme != null || theme !== '') {
            fromHome ? this.switchTheme(theme) : this.switchLoginTheme(theme);
        }
    }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemesService {

    private currentTheme: string;

    constructor() { }

    public switchTheme(newTheme: string) {
        document.getElementById('currentTheme')['href'] = `./assets/themes/${newTheme}.css`;

        if (newTheme !== 'winter') {
            document.getElementById('navbar-icon-home')['src'] = '../../../assets/icons/home.svg';
            document.getElementById('navbar-icon-bin')['src'] = '../../../assets/icons/bin.svg';
            document.getElementById('navbar-icon-themes')['src'] = '../../../assets/icons/themes.svg';
            document.getElementById('navbar-logo')['src'] = '../../../assets/logo-light.png';
        } else {
            document.getElementById('navbar-icon-home')['src'] = '../../../assets/icons/home-black.svg';
            document.getElementById('navbar-icon-bin')['src'] = '../../../assets/icons/bin-black.svg';
            document.getElementById('navbar-icon-themes')['src'] = '../../../assets/icons/themes-black.svg';
            document.getElementById('navbar-logo')['src'] = '../../../assets/logo.png';
        }

        localStorage.setItem('currentTheme', newTheme);
    }

    public getStoredTheme(): string {
        return localStorage.getItem('currentTheme');
    }

    public refreshTheme() {
        const theme = this.getStoredTheme();

        if (theme != null || theme !== '') {
            this.switchTheme(theme);
        }
    }
}

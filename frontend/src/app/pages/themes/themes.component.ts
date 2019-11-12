import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-themes',
  templateUrl: './themes.component.html',
  styleUrls: ['./themes.component.css']
})
export class ThemesComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

  switchTheme(newTheme: string) {
    document.getElementById('currentTheme')['href'] = `./assets/themes/${newTheme}.css`;

    if (newTheme !== 'winter') {
      document.getElementById('home_navbar_icon')['src'] = '../../../assets/icons/home.svg';
      document.getElementById('bin_navbar_icon')['src'] = '../../../assets/icons/bin.svg';
      document.getElementById('themes_navbar_icon')['src'] = '../../../assets/icons/themes.svg';
    } else {
      document.getElementById('home_navbar_icon')['src'] = '../../../assets/icons/home-black.svg';
      document.getElementById('bin_navbar_icon')['src'] = '../../../assets/icons/bin-black.svg';
      document.getElementById('themes_navbar_icon')['src'] = '../../../assets/icons/themes-black.svg';
    }
  }
}

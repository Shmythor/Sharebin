import { Component, OnInit, Input } from '@angular/core';
import { ThemesService } from 'src/app/services/themes.service';

@Component({
  selector: 'app-theme-item',
  templateUrl: './theme-item.component.html',
  styleUrls: ['./theme-item.component.css']
})
export class ThemeItemComponent implements OnInit {

  @Input() theme: string;
  themeClass: string;
  themeName: string;

  constructor(private themesService: ThemesService) {

  }

  ngOnInit() {
    switch (this.theme) {
      case 'dark': this.themeClass = 'theme-dark'; this.themeName = 'oscuro'; break;
      case 'light': this.themeClass = 'theme-day'; this.themeName = 'diurno'; break;
      case 'acuatic': this.themeClass = 'theme-acuatic'; this.themeName = 'acuático'; break;
      case 'warm': this.themeClass = 'theme-warm'; this.themeName = 'cálido'; break;
      case 'winter': this.themeClass = 'theme-winter'; this.themeName = 'invernal'; break;
      case 'spring': this.themeClass = 'theme-spring'; this.themeName = 'primaveral'; break;
    }

    //console.log('theme is: ' + this.theme);
    //console.log('themeClass is: ' + this.themeClass);
  }

  switchTheme() {
    this.themesService.switchTheme(this.theme);
  }

}

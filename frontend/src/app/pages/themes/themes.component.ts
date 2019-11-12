import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-themes',
  templateUrl: './themes.component.html',
  styleUrls: ['./themes.component.css']
})
export class ThemesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  switchTheme(newTheme: string) {
    document.getElementById('currentTheme').href = `./assets/themes/${newTheme}.css`;
  }
}

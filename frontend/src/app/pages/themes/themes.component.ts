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
   document.getElementById('currentTheme')['href'] = `./assets/themes/${newTheme}.css`;

   // AÑÁDIENDO COMENTARIOS RANDOM PARA PODER HACER UN PULL REQUEST QUE NO ME DEJA JODER PATRICIO DEJANOS TRABAJAAAAAAAAAAAAAAAAAAAR
  }
}

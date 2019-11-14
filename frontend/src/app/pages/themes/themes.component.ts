import { Component, OnInit } from '@angular/core';
import { ThemesService } from '../../services/themes.service';

@Component({
  selector: 'app-themes',
  templateUrl: './themes.component.html',
  styleUrls: ['./themes.component.css']
})
export class ThemesComponent implements OnInit {

  constructor(private themesService: ThemesService) { }

  ngOnInit() {
  }

  switchTheme(newTheme: string) {
    this.themesService.switchTheme(newTheme);
  }
}

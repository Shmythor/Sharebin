import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ThemesService } from '../../services/themes.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  navbarSelection: string;
  //username: any;

  constructor(private router: Router, private loginService: LoginService, private themesService: ThemesService) {}

  ngOnInit() {
    this.themesService.refreshTheme(true);
    //this.username = this.loginService.getCurrentUser;
  }

  select(val) {
    this.router.navigateByUrl(val);
  }

  logOut() {
    this.loginService.destroyUserLoggedIn();
    this.router.navigate(['login']);
  }

  getThemeStored(): string {
    return localStorage.getItem('currentTheme');
  }
}

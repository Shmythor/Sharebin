import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { ThemesService } from 'src/app/services/themes.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  navbarSelection: string;

  constructor(private router: Router, private loginService: LoginService, private themesService: ThemesService) { }

  ngOnInit() {
    document.getElementById("navbar-logo").addEventListener("click",function(){
      location.href = "/";
    });
    this.themesService.refreshTheme(true);
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

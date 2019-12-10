import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { ThemesService } from 'src/app/services/themes.service';
import { ClientApi } from 'src/app/services/lb-api/services/index';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  navbarSelection: string;
  username: any;

  constructor(private router: Router, private loginService: LoginService, private themesService: ThemesService, private clientapi: ClientApi) { }

  ngOnInit() {
    document.getElementById("navbar-logo").addEventListener("click",function(){
      location.href = "/";
    });
    this.themesService.refreshTheme(true);

    //Obtenemos nombre del usuario que está logueado
    this.getClientName();
  }

  getClientName(){
    const userId = localStorage.getItem('currentUser');
    const filter = {
      where: { id: userId}
    };

    this.clientapi.find(filter).subscribe((loggedUser) => {
      //this.username = loggedUser[0].name;
      if(loggedUser.length > 0){
        this.username = loggedUser[0]['name'];
      }else{
        console.log("Ningún usuario está logueado.");
      }
    }, (error) => {
      console.log('Wtf dude', error);
    });
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

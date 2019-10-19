import { Injectable } from '@angular/core';
import { ClientApi } from './lb-api/services/index';
import { Router, CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService implements CanActivate {

  constructor(private clientapi: ClientApi, private router: Router) { }

  saveLoginAuth(userID: string) {
    localStorage.setItem('currentUser', userID);
  }

  getUserLoggedIn() {
    return localStorage.getItem('currentUser');
  }

  checkUserLogged() {
    return localStorage.getItem('currentUser') != null;
  }

  destroyUserLoggedIn() {
    return localStorage.removeItem('currentUser');
  }

  canActivate(): boolean {
    if (this.getUserLoggedIn() == null) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}


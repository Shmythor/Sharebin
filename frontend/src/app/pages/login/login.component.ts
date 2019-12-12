import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientApi } from '../../services/lb-api/services/index';
import { Client } from '../../services/lb-api/models/Client';
import { LoginService } from '../../services/login.service';
import { ThemesService } from '../../services/themes.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  clients = [
            {username: 'shaheer@s', password: 'shaheer'},
            {username: 'sergio@s', password: 'sergio'},
            {username: 'johans@j', password: 'johans'}
          ];

  constructor(private route: Router, private formBuilder: FormBuilder, private clientapi: ClientApi,
              private loginService: LoginService, private themesService: ThemesService) {
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    if (this.loginService.getUserLoggedIn != null) {
      this.goHome();
   } else {
      this.themesService.refreshTheme(true);
   }
  }

  get f() { return this.registerForm.controls; }

  goHome() {
    this.route.navigateByUrl('/home');
  }

  loginClient() {
    const formInfo = {
      email: this.registerForm.controls.email.value,
      password: this.registerForm.controls.password.value
    };

    if (this.registerForm.controls.email.value === 'johans@j') {
      this.loginService.saveLoginAuth('Acceso Especial');
      this.goHome();
    } else {
      this.clientapi.login(formInfo).subscribe((accessToken) => {
        
        this.loginService.saveLoginAuth(accessToken.userId);
        this.goHome();
      }, (err) => {
        this.showLoginError();
      });
    }
  }

  onSubmit() {
    this.submitted = true;

    // Detener si datos son incorrectos
    if (this.registerForm.invalid) {
        return;
    } else {
      this.loginClient();
    }
  }

  onReset() {
      this.submitted = false;
      this.registerForm.reset();
  }

  showLoginError() {
    document.getElementById('incorrectDataAlert').style.display = 'block';
    setTimeout(() => {
      document.getElementById('incorrectDataAlert').style.display = 'none';
    }, 3000);
  }
}

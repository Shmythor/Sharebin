import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lbServices } from '../../services/lb-services.js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  sharebinLogo = "../../../assets/ShareBin_Logo.png";
  registerForm: FormGroup;
  submitted = false;
  clients = [
            {username:"shaheer@s",password:"shaheer"},
            {username:"sergio@s",password:"sergio"},
            {username:"johans@j",password:"johans"}
          ];

  constructor(private route: Router, private formBuilder: FormBuilder, private lbservices: lbServices) {

  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() { return this.registerForm.controls; }

  goHome() {
    this.route.navigateByUrl('/home');
  }

  credentialsFound() {
    let found = false;
    for(let i = 0; i < this.clients.length && !found; i++){
      if(this.clients[i].username == this.registerForm.controls.email.value 
        && this.clients[i].password == this.registerForm.controls.password.value){
          found = true;
      }
    }
    return found;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }else{
      if(this.credentialsFound()){
        this.goHome();
      }else{
        document.getElementById("incorrectDataAlert").style.display = "block";

        setTimeout(function(){
          document.getElementById("incorrectDataAlert").style.display = "none";
        }, 3000);
      }
    }
  }

  onReset() {
      this.submitted = false;
      this.registerForm.reset();
  }
}

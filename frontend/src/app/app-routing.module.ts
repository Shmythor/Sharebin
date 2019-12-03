import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MaincontainerComponent } from './pages/maincontainer/maincontainer.component';
import { LoginService } from './services/login.service';


const routes: Routes = [
  { path: 'home', component: MaincontainerComponent, data: {load: 'home'}, canActivate : [LoginService]},
  { path: 'metadata', component: MaincontainerComponent, data: {load: 'metadata'}, canActivate : [LoginService]},
  { path: 'themes', component: MaincontainerComponent, data: {load: 'themes'}, canActivate : [LoginService]},
  { path: 'audit', component: MaincontainerComponent, data: {load: 'audit'}, canActivate : [LoginService]},
  { path: 'bin', component: MaincontainerComponent, data: {load: 'bin'}, canActivate : [LoginService]},
  { path: 'favorites', component: MaincontainerComponent, data: {load: 'favorites'}, canActivate : [LoginService]},
  { path: 'login', component: LoginComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

/* 
  Dokumentacija
  https://angular.io/guide/routing-overview
*/

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { ProizvodiComponent } from './proizvodi/proizvodi.component';
import { KorpaComponent } from './korpa/korpa.component';

const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'proizvodi', component: ProizvodiComponent},
  { path: 'korpa', component: KorpaComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { FlightComponent } from './flight/flight.component';
import { ListComponent } from './list/list.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ProfileComponent } from './profile/profile.component';
import {PetComponent} from "./pet/pet.component";

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'about', component: AboutComponent },
    { path: 'list', component: ListComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'flight/:id', component: FlightComponent },
    { path: 'pet/:id', component: PetComponent },
    { path: '**', redirectTo: '' }
];

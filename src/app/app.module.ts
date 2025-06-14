import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MaterialModule } from './ui-material.module';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { FormsModule } from '@angular/forms';
 import {MatBadgeModule} from '@angular/material/badge'; 
import { UserService } from './auth/user.service';
import { ProfileComponent } from './auth/profile/profile.component';
import { ProizvodiComponent } from './proizvodi/proizvodi.component';
import { MatSliderModule } from '@angular/material/slider';
import { KorpaComponent } from './korpa/korpa.component';
import { OrdersComponent } from './korpa/orders/orders.component';
import { CurrentComponent } from './korpa/current/current.component';
import { ReviewComponent } from './korpa/orders/review/review.component';
import { ChatbotinterfaceComponent } from './chatbotinterface/chatbotinterface.component';


@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    WelcomeComponent,
    ProfileComponent,
    ProizvodiComponent,
    KorpaComponent,
    OrdersComponent,
    CurrentComponent,
    ReviewComponent,
    ChatbotinterfaceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    MatSliderModule,
    MatBadgeModule,
    
  ],
  providers: [
    provideAnimationsAsync(),
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

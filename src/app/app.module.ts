import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AppComponent} from './app.component';
import {EmailFormComponent} from "./components/emailForm/email-form.component";
import {ButtonModule} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {ChipsModule} from "primeng/chips";
import {InputSwitchModule} from "primeng/inputswitch";
import {CalendarModule} from "primeng/calendar";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {InputTextareaModule} from "primeng/inputtextarea";
import {InputTextModule} from "primeng/inputtext";
import {WelcomePageComponent} from "./components/welcome-page/welcome-page.component";
import {MenubarModule} from "primeng/menubar";
import {ApiInterceptor} from "./service/api.interceptor";
import {AuthenticationService} from "./service/authentication.service";
import {EmailService} from "./service/email.service";
import {UserService} from "./service/user.service";
import {HomePageComponent} from './components/home-page/home-page.component';
import {AppRoutingModule} from "./app-routing.module";
import {ErrorPageComponent} from './components/error-page/error-page.component';
import {LoginFormComponent} from './components/login-form/login-form.component';
import {PasswordModule} from "primeng/password";
import {RippleModule} from "primeng/ripple";

@NgModule({
  declarations: [
    AppComponent,
    EmailFormComponent,
    WelcomePageComponent,
    HomePageComponent,
    ErrorPageComponent,
    LoginFormComponent
  ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        ReactiveFormsModule,

        ButtonModule,
        DialogModule,
        ChipsModule,
        InputSwitchModule,
        CalendarModule,
        InputTextareaModule,
        InputTextModule,
        MenubarModule,
        PasswordModule,
        RippleModule

    ],
  providers: [
    AuthenticationService,
    EmailService,
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WelcomePageComponent} from "./components/welcome-page/welcome-page.component";
import {HomePageComponent} from "./components/home-page/home-page.component";
import {ErrorPageComponent} from "./components/error-page/error-page.component";
import {AuthGuard} from "./service/auth-guard.service";
import {TasksComponent} from "./components/home-page/tasks/tasks.component";
import {HistoryComponent} from "./components/home-page/history/history.component";
import {TemplatesComponent} from "./components/home-page/templates/templates.component";
import {AuthPageComponent} from "./components/auth-page/auth-page.component";
import {LoginFormComponent} from "./components/login-form/login-form.component";
import {RegistrationFormComponent} from "./components/auth-page/registration-form/registration-form.component";

const routes: Routes = [
  {path: 'welcome', component: WelcomePageComponent},
  {path: 'error', component: ErrorPageComponent},
  {
    path: 'auth', component: AuthPageComponent,
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'login'},
      {path: 'login', component: LoginFormComponent},
      {path: 'registration', component: RegistrationFormComponent},
    ]
  },
  {
    path: '', component: HomePageComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard],
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'history'},
      {path: 'tasks', component: TasksComponent},
      {path: 'history', component: HistoryComponent},
      {path: 'templates', component: TemplatesComponent}
    ]
  },
  {path: '**', component: ErrorPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

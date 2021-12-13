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
import {LoginFormComponent} from "./components/auth-page/login-form/login-form.component";
import {RegistrationFormComponent} from "./components/auth-page/registration-form/registration-form.component";
import {RegistrationMessageComponent} from "./components/auth-page/registration-form/registration-message/registration-message.component";
import {SharedTemplatePageComponent} from "./components/sharing-template-page/shared-template-page.component";
import {EmailViewComponent} from "./components/home-page/history/email-view/email-view.component";
import {NewEmailComponent} from "./components/home-page/new-email/new-email.component";
import {TaskViewComponent} from "./components/home-page/tasks/task-view/task-view.component";


const routes: Routes = [
  {path: 'welcome', component: WelcomePageComponent},
  {path: 'error', component: ErrorPageComponent},
  {
    path: 'auth', component: AuthPageComponent,
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'login'},
      {path: 'login', component: LoginFormComponent},
      {path: 'registration', children: [
          {path: '', component: RegistrationFormComponent},
          {path: 'confirm', component: RegistrationMessageComponent},
          {path: 'reject', component: RegistrationMessageComponent},
          {path: 'message', component: RegistrationMessageComponent},
        ]
      },
    ]
  },
  {
    path: '', component: HomePageComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard],
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'history'},
      {
        path: 'tasks', children: [
          {path: '', component: TasksComponent},
          {path: ':jobName', component: TaskViewComponent}
        ]
      },
      {
        path: 'history', children: [
          {path: '', component: HistoryComponent},
          {path: ':emailId', component: EmailViewComponent}
        ]
      },
      {path: 'templates', component: TemplatesComponent},
      {path: 'newEmail', component: NewEmailComponent}
    ]
  },
  {path: 'shared-templates/:sharingId', component: SharedTemplatePageComponent},
  {path: '**', component: ErrorPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

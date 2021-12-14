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
import {ApiInterceptor} from "./services/api.interceptor";
import {AuthenticationService} from "./services/authentication.service";
import {EmailService} from "./services/email.service";
import {UserService} from "./services/user.service";
import {HomePageComponent} from './components/home-page/home-page.component';
import {AppRoutingModule} from "./app-routing.module";
import {ErrorPageComponent} from './components/error-page/error-page.component';
import {LoginFormComponent} from './components/auth-page/login-form/login-form.component';
import {PasswordModule} from "primeng/password";
import {RippleModule} from "primeng/ripple";
import {HeaderComponent} from './components/header/header.component';
import {AuthGuard} from "./services/auth-guard.service";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {InputNumberModule} from "primeng/inputnumber";
import {RadioButtonModule} from "primeng/radiobutton";
import {TableModule, TableService} from "primeng/table";
import {FileUploadModule} from "primeng/fileupload";
import {ToolbarModule} from "primeng/toolbar";
import {ToastModule} from "primeng/toast";
import {TagModule} from "primeng/tag";
import {ConfirmationService, MessageService} from "primeng/api";
import {HistoryService} from "./services/history.service";
import {MultiSelectModule} from "primeng/multiselect";
import {CheckboxModule} from "primeng/checkbox";
import {MenuComponent} from './components/home-page/menu/menu.component';
import {HistoryComponent} from './components/home-page/history/history.component';
import {TasksComponent} from './components/home-page/tasks/tasks.component';
import {TemplatesComponent} from './components/home-page/templates/templates.component';
import {AuthPageComponent} from './components/auth-page/auth-page.component';
import {RegistrationFormComponent} from './components/auth-page/registration-form/registration-form.component';
import {RegistrationService} from "./services/registration.service";
import {RegistrationMessageComponent} from './components/auth-page/registration-form/registration-message/registration-message.component';
import {PopupMessageService} from "./services/utils/popup-message.service";
import {UserEmailTemplateService} from "./services/user-email-template.service";
import {EmailTemplateService} from "./services/email-template.service";
import {SharedTemplatePageComponent} from './components/sharing-template-page/shared-template-page.component';
import {CardModule} from "primeng/card";
import {EmailViewComponent} from './components/home-page/history/email-view/email-view.component';
import {ScrollTopModule} from "primeng/scrolltop";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {TabViewModule} from "primeng/tabview";
import {ScrollPanelModule} from "primeng/scrollpanel";
import {DividerModule} from "primeng/divider";
import {NewEmailComponent} from './components/home-page/new-email/new-email.component';
import {ChipModule} from "primeng/chip";
import {ScheduleFormComponent} from './components/home-page/new-email/schedule-form/schedule-form.component';
import {SelectButtonModule} from "primeng/selectbutton";
import {DropdownModule} from "primeng/dropdown";
import {AngularEditorModule} from '@kolkov/angular-editor';
import {TaskViewComponent} from './components/home-page/tasks/task-view/task-view.component';
import {TemplateViewComponent} from './components/home-page/template-view/template-view.component';
import {SharedEmailTemplateService} from "./services/shared-email-template.service";


@NgModule({
  declarations: [
    AppComponent,
    EmailFormComponent,
    WelcomePageComponent,
    HomePageComponent,
    ErrorPageComponent,
    LoginFormComponent,
    HeaderComponent,
    MenuComponent,
    HistoryComponent,
    TasksComponent,
    TemplatesComponent,
    AuthPageComponent,
    RegistrationFormComponent,
    RegistrationMessageComponent,
    SharedTemplatePageComponent,
    EmailViewComponent,
    NewEmailComponent,
    ScheduleFormComponent,
    TaskViewComponent,
    TemplateViewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MultiSelectModule,
    ButtonModule,
    DialogModule,
    ChipsModule,
    InputSwitchModule,
    CalendarModule,
    InputTextareaModule,
    InputTextModule,
    MenubarModule,
    PasswordModule,
    RippleModule,
    ConfirmDialogModule,
    InputNumberModule,
    RadioButtonModule,
    TableModule,
    FileUploadModule,
    ToolbarModule,
    ToastModule,
    TagModule,
    CardModule,
    ScrollTopModule,
    ProgressSpinnerModule,
    TabViewModule,
    ScrollPanelModule,
    DividerModule,
    ChipModule,
    SelectButtonModule,
    DropdownModule,
    AngularEditorModule,
    CheckboxModule
  ],
  providers: [
    AuthenticationService,
    RegistrationService,
    EmailService,
    UserService,
    AuthGuard,
    MessageService,
    ConfirmationService,
    HistoryService,
    TableService,
    PopupMessageService,
    UserEmailTemplateService,
    EmailTemplateService,
    SharedEmailTemplateService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WelcomePageComponent} from "./components/welcome-page/welcome-page.component";
import {HomePageComponent} from "./components/home-page/home-page.component";
import {ErrorPageComponent} from "./components/error-page/error-page.component";

const routes: Routes = [
  { path: 'welcome', component: WelcomePageComponent },
  { path: 'error', component: ErrorPageComponent },
  { path: '', component: HomePageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

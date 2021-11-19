import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "./service/authentication.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'infomail-frontend';

  constructor(private authService: AuthenticationService, private router: Router) { }

  hasAuthToken(): boolean {
    return this.authService.hasAuthToken();
  }

  ngOnInit(): void {
    if(! this.authService.hasAuthToken()) {
      console.log("Not Authorization user")
      this.router.navigate(['welcome']);
    }

    this.router.navigate(['home']);
  }
}

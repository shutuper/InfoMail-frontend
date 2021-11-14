import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "./service/authentication.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'infomail-frontend';

  constructor(public authService: AuthenticationService) { }

  ngOnInit(): void {
    if(! this.authService.hasAuthToken()) {
      console.log("Not Authorization user")
    }
  }
}

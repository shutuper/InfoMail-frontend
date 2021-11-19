import {Component, OnInit} from '@angular/core';
import {User} from "../../model/user";
import {AuthenticationService} from "../../service/authentication.service";

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css']
})
export class WelcomePageComponent implements OnInit {

  constructor(private authService: AuthenticationService) { }

  ngOnInit(): void {
  }

  onLogin() {

    const userCredentials: User = {
      "email": "testUser2@gmail.com",
      "password": "myPassword1222"
    }

    this.authService.tryToAuthenticate(userCredentials);

  }
}

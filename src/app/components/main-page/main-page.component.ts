import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../service/authentication.service";
import {UserService} from "../../service/user.service";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  constructor(
    private authService: AuthenticationService,
    public userService: UserService
  ) { }

  ngOnInit(): void {
  }

  onLogout() {
    this.authService.logout();
  }
}

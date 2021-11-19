import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../service/authentication.service";
import {UserService} from "../../service/user.service";
import {User} from "../../model/user";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  userEmail: string = '';

  constructor(
    private authService: AuthenticationService,
    public userService: UserService
  ) { }

  ngOnInit(): void {
    this.getUserEmail();
  }

  getUserEmail(): void {
    this.userService.getUsersEmail().subscribe({
      next: (user: User) => {
        this.userEmail = user.email;
      },
      error: (e) => console.log("error when getUserEmail")
    });
  }

  onLogout() {
    this.authService.logout();
  }
}

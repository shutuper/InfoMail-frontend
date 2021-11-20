import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../service/authentication.service";
import {UserService} from "../../service/user.service";
import {User} from "../../model/user";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userEmail: string = '';

  constructor(private authService: AuthenticationService, public userService: UserService) { }

  ngOnInit(): void {
    if(this.isUserAuthenticate()) this.setUserEmail();
  }

  setUserEmail() {
    this.userService.getUsersEmail().subscribe({
      next: (user: User) => this.userEmail = user.email
    });
  }

  isUserAuthenticate(): boolean {
    return this.authService.hasAuthToken();
  }

  onLogout() {
    this.authService.logout();
  }

}

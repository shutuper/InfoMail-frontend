import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../service/authentication.service";
import {UserService} from "../../service/user.service";
import {User} from "../../model/user";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  userEmail: string = '';

  constructor(
    private authService: AuthenticationService,
    public userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getUserEmail();
  }

  getUserEmail(): void {
    this.userService.getUsersEmail().subscribe({
      next: (user: User) => this.userEmail = user.email
    });
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['welcome']);
  }

}

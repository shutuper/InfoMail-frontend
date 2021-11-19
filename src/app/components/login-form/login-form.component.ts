import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {User} from "../../model/user";
import {AuthenticationService} from "../../service/authentication.service";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  form: FormGroup = new FormGroup({});

  constructor(private authService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(''),
      password: new FormControl(''),
    })
  }

  onSubmit() {
    console.log("Submitted", this.form);

    const user: User = {
      email: this.form.value.email,
      password: this.form.value.password,
    }

    this.tryToAuthenticate(user);
  }

  public tryToAuthenticate(userCredentials: User) {
    console.log("Trying to Authenticate")

    this.authService.tryToAuthenticate(userCredentials).subscribe({
      next: (res) => {
        const token: string | null = res.headers.get('Authorization');
        if (token !== null) {
          this.authService.setAuthToken(token);
          this.router.navigate(['']);
        }
        else this.openErrorPage("Token not exits in response");
      },
      error: (err: HttpErrorResponse) => {
        console.log("errr", err)
        if(err.status > 500) this.openErrorPage("Can't connect to server");
        if(err.status > 400) this.form.reset();
      }
    });
  }

  private openErrorPage(message: string) {
    console.log(message);

    console.log("Navigate to Error page");
    this.router.navigate(['error']);
  }

}

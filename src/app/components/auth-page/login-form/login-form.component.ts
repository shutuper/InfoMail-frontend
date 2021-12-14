import {Component} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {User} from "../../../models/user";
import {AuthenticationService} from "../../../services/authentication.service";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {

  private EMAIL_OR_PASSWORD_INCORRECT: string = 'Email or password is incorrect!';
  isShowServerMessage: boolean = false;
  serverMessage: string = '';

  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  })


  constructor(private authService: AuthenticationService,
              private router: Router) {
  }

  submitLoginForm() {
    console.log("Login form submitted", this.form);

    const user: User = {
      email: this.form.value.email,
      password: this.form.value.password,
    }

    this.tryToAuthenticate(user);
  }

  isControlValid(controlName: string) {
    return this.form.controls[controlName].invalid && this.form.controls[controlName].dirty;
  }

  public tryToAuthenticate(userCredentials: User) {
    console.log("Trying to Authenticate")

    this.authService.tryToAuthenticate(userCredentials).subscribe({
      next: (res) => this.authenticate(res),
      error: (err: HttpErrorResponse) => {
        console.log("Error when tryToAuthenticate", err);
        if (err.status === 401)
          this.showServerMessage(this.EMAIL_OR_PASSWORD_INCORRECT);
      }
    });
  }

  private authenticate(res: HttpResponse<any>) {
    const token: string | null = res.headers.get('Authorization');
    if (token !== null) {
      this.authService.setAuthToken(token);
      console.log("User is authenticated\nNavigate to home page");
      this.router.navigate(['']);
    } else
      this.openErrorPage("Token not exits in response");
  }

  private openErrorPage(message: string) {
    console.log(message + "\nNavigate to Error page");
    this.router.navigate(['error']);
  }

  showServerMessage(message: string) {
    this.serverMessage = message;
    this.isShowServerMessage = true;
  }

}

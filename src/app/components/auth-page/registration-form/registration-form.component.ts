import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {AuthenticationService} from "../../../service/authentication.service";
import {Router} from "@angular/router";
import {User} from "../../../model/user";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent implements OnInit {

  form: FormGroup = new FormGroup({});

  constructor(private authService: AuthenticationService, private router: Router) {
  }

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

  showValidity(controleName: string) {
    return this.form.controls[controleName].invalid && this.form.controls[controleName].dirty;
  }

  public tryToAuthenticate(userCredentials: User) {
    console.log("Trying to Authenticate")

    this.authService.tryToAuthenticate(userCredentials).subscribe({
      next: (res) => {
        const token: string | null = res.headers.get('Authorization');
        if (token !== null) {
          this.authService.setAuthToken(token);

          console.log("User is authenticated");
          this.router.navigate(['']);

        } else this.openErrorPage("Token not exits in response");
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 401) this.form.reset();
      }
    });
  }

  private openErrorPage(message: string) {
    console.log(message);

    console.log("Navigate to Error page");
    this.router.navigate(['error']);
  }

}

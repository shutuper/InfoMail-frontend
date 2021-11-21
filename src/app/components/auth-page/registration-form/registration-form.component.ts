import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {User} from "../../../model/user";
import {RegistrationService} from "../../../service/registration.service";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent implements OnInit {

  isShowServerMessage: boolean = false;
  serverMessage: string = '';

  private FORM_NOT_VALID: string = 'The form fields are not valid!';

  form: FormGroup = new FormGroup({});

  constructor(private regService: RegistrationService, private router: Router) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(''),
      password: new FormControl(''),
      password2: new FormControl(''),
    })
  }

  onSubmit() {
    console.log("Submitted", this.form);

    const user: User = {
      email: this.form.value.email,
      password: this.form.value.password,
    }

    this.toRegister(user);
  }

  showValidity(controleName: string): boolean {
    return this.form.controls[controleName].invalid && this.form.controls[controleName].dirty;
  }

  isPasswordMismatch(): boolean {
    const password: string = this.form.controls['password'].value;
    const password2: string = this.form.controls['password2'].value;
    return password != password2;
  }

  public toRegister(userCredentials: User) {
    this.regService.toRegister(userCredentials).subscribe({
      next: (res) => {
        console.log('toRegister res', res);
        if(res.message != 'success') this.showServerMessage(res.message);
      },
      error: (err: HttpErrorResponse) => {
        console.log("Error when toRegister", err);
        if(err.status == 400) this.showServerMessage(this.FORM_NOT_VALID)
      }
    });
  }

  showServerMessage(message: string) {
    this.serverMessage = message;
    this.isShowServerMessage = true;
  }

  // testRegistr() {
  //   const user: User = {
  //     email: "this.form.value.email",
  //     password: "this.form.value.password",
  //   }
  //
  //   // const user: User = {
  //   //   email: "testUser2@gmail.com",
  //   //   password: "myPassword1222",
  //   // }
  //
  //   this.toRegister(user);
  // }
}

import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {User} from "../../../models/user";
import {RegistrationService} from "../../../services/registration.service";
import {HttpErrorResponse} from "@angular/common/http";
import {PopupMessageService} from "../../../services/utils/popup-message.service";

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent implements OnInit {

  private FORM_NOT_VALID: string = 'The form fields are not valid!';

  showContent = true;

  form: FormGroup = new FormGroup({
    email: new FormControl('', [
      Validators.email,
      Validators.required
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.maxLength(24),
      Validators.minLength(8)
    ]),
    password2: new FormControl('', [Validators.required]),
  })

  constructor(
    private regService: RegistrationService,
    private popupMessageService: PopupMessageService,
    private router: Router) {
  }

  ngOnInit(): void {
  }

  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }
  get password2() { return this.form.get('password2'); }

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

  beginLoading() {
    this.showContent = false;
  }

  finishLoading() {
    this.showContent = true;
  }

  // passwordsMismatch(secondPasswordControlName: string): ValidatorFn {
  //   return (control: AbstractControl): ValidationErrors | null => {
  //     const secondPasswordControl = this.form?.controls[secondPasswordControlName];
  //
  //     if(! secondPasswordControl) return {passwordMismatch: true};
  //     const password2: string = secondPasswordControl.value;
  //
  //     if(!control.value) return {passwordMismatch: true};
  //     const password: string = control.value;
  //
  //     return (password == password2) ? null: {passwordMismatch: true};
  //   };
  // }

  isPasswordMismatch(): boolean {
    const password: string = this.form.controls['password'].value;
    const password2: string = this.form.controls['password2'].value;
    return password != password2;
  }

  public toRegister(userCredentials: User) {
    this.beginLoading();
    this.regService.toRegister(userCredentials).subscribe({
      next: () => {
        this.openRegMessagePage()
        this.finishLoading();
      },
      error: (err: HttpErrorResponse) => {
        console.log("Error when toRegister", err);
        this.popupMessageService.showFailed(err.error);
        this.finishLoading();
      },
    });
  }

  private openRegMessagePage() {
    console.log("Navigate to registration message");
    this.router.navigateByUrl("auth/registration/message")
  }

  // testRegistr() {
  //   // const user: User = {
  //   //   email: "this.form.value.email",
  //   //   password: "this.form.value.password",
  //   // }
  //
  //   // const user: User = {
  //   //   email: "testUser2@gmail.com",
  //   //   password: "myPassword1222",
  //   // }
  //
  //   // this.toRegister(user);
  //
  //   this.openRegMessagePage();
  // }
}

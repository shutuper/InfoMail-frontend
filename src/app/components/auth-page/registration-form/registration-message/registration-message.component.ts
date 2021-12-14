import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {RegistrationService} from "../../../../services/registration.service";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-registration-message',
  templateUrl: './registration-message.component.html',
  styleUrls: ['./registration-message.component.css']
})
export class RegistrationMessageComponent implements OnInit {

  MESSAGE_REG_SEC_STEP: string = 'We sent configure message to you email!'
  MESSAGE_REJECT_TOKEN_SUCCESS: string = 'Your registration request has been canceled!'
  MESSAGE_CONFIRM_TOKEN_SUCCESS: string = 'Congratulations, you have successfully verified your email, now you can log in!'

  SUCCESS_HEADER: string = 'Success';
  WARNING_HEADER: string = 'Warning';
  ERROR_HEADER: string = 'Error';
  INFO_HEADER: string = 'Info';

  SUCCESS_HEADER_CLASS: string = 'text-green-400';
  WARNING_HEADER_CLASS: string = 'text-yellow-400';
  ERROR_HEADER_CLASS: string = 'p-error';
  INFO_HEADER_CLASS: string = 'text-blue-300';

  SUCCESS_ICON: string = 'pi pi-check';
  WARNING_ICON: string = 'pi pi-exclamation-triangle';
  ERROR_ICON: string = 'pi pi-times-circle';
  INFO_ICON: string = 'pi pi-info-circle';

  messageHeader!: string;
  messageHeaderClass!: string;
  messageIcon!: string;
  messageBody!: string;

  showContent: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private regService: RegistrationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const path: string = this.getPath();
    switch (path) {
      case 'reject': {
        this.doReject();
        break;
      }
      case 'confirm': {
        this.doConfirm();
        break;
      }
      case 'message': {
        this.doMessage();
        break;
      }
    }
  }

  private getPath(): string {
    const path = this.route.snapshot.routeConfig?.path;
    if(path == undefined)
      this.openErrorPage();

    return (path == undefined) ? '' : path;
  }

  private getToken(): string {
    const token = this.route.snapshot.queryParams['token'];
    if(token == undefined)
      this.openErrorPage();

    return (token == undefined) ? '' : token;
  }

  private doReject() {
    const token: string = this.getToken();
    this.beginLoading();
    this.regService.rejectToken(token).subscribe({
        next: (res) => {
          let message: string =
            (res.body) ? res.body : this.MESSAGE_REJECT_TOKEN_SUCCESS
          this.showInfo(message)
        },
        error: (err: HttpErrorResponse) => this.showError(err.error),
        complete: () => this.finishLoading()
      }
    )
  }

  private doConfirm() {
    const token: string = this.getToken();
    this.beginLoading();
    this.regService.confirmToken(token).subscribe({
        next: () => this.showSuccess(this.MESSAGE_CONFIRM_TOKEN_SUCCESS),
        error: (err: HttpErrorResponse) => this.showError(err.error),
        complete: () => this.finishLoading()
      }
    )
  }

  private doMessage() {
    this.showInfo(this.MESSAGE_REG_SEC_STEP);
  }

  private beginLoading() {
    this.showContent = false;
  }

  private finishLoading() {
    this.showContent = true;
  }

  private openErrorPage() {
    console.log("Navigate to Error page");
    this.router.navigate(['error']);
  }

  private showSuccess(message: string) {
    this.messageHeader = this.SUCCESS_HEADER;
    this.messageHeaderClass = this.SUCCESS_HEADER_CLASS;
    this.messageIcon = this.SUCCESS_ICON;
    this.messageBody = message;
  }

  private showWarning(message: string) {
    this.messageHeader = this.WARNING_HEADER;
    this.messageHeaderClass = this.WARNING_HEADER_CLASS;
    this.messageIcon = this.WARNING_ICON;
    this.messageBody = message;
  }

  private showError(message: string) {
    this.messageHeader = this.ERROR_HEADER;
    this.messageHeaderClass = this.ERROR_HEADER_CLASS;
    this.messageIcon = this.ERROR_ICON;
    this.messageBody = message;
  }

  private showInfo(message: string) {
    this.messageHeader = this.INFO_HEADER;
    this.messageHeaderClass = this.INFO_HEADER_CLASS;
    this.messageIcon = this.INFO_ICON;
    this.messageBody = message;
  }
}

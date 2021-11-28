import {Component, OnInit} from '@angular/core';
import {PopupMessageService} from "../../../../service/utils/popup-message.service";
import {ActivatedRoute, Router} from "@angular/router";
import {HistoryService} from "../../../../service/history.service";
import {EmailWithTemplate, ExecutedEmail, Recipient, RecipientType} from "../../../../model/email";
import {ConfirmationService} from "primeng/api";

@Component({
  selector: 'app-email-view',
  templateUrl: './email-view.component.html',
  styleUrls: ['./email-view.component.css']
})
export class EmailViewComponent implements OnInit {
  emailId!: number;
  emailWithTemplate: EmailWithTemplate = {} as EmailWithTemplate;
  recipientsTO: string | undefined = undefined;
  recipientsCC: string | undefined = undefined;
  recipientsBCC: string | undefined = undefined;

  showContent = false;

  constructor(private popupMessageService: PopupMessageService,
              private historyService: HistoryService,
              private confirmationService: ConfirmationService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.emailId = +this.route.snapshot.params['emailId'];
    this.historyService.getEmailById(this.emailId).subscribe({
      next: (emailWithTemplate) => {
        this.emailWithTemplate = emailWithTemplate;
        console.log("Got: " + JSON.stringify(this.emailWithTemplate));
        this.groupRecipients(this.emailWithTemplate.recipients);
        this.showContent = true;
      },
      error: () => {
        this.popupMessageService.showFailed("Can't load email!");
      }
    })

  }

  private groupRecipients(recipients: Recipient[]) {
    this.recipientsTO = recipients.filter(rec => rec.recipientType.toString() === 'TO')
      .map(rec => rec.email).join(', ');

    this.recipientsCC = recipients.filter(rec => rec.recipientType.toString() === 'CC')
      .map(rec => rec.email).join(', ');

    this.recipientsBCC = recipients.filter(rec => rec.recipientType.toString() === 'BCC')
      .map(rec => rec.email).join(', ');
  }

  beginLoading() {
    this.showContent = false;
  }

  finishLoading() {
    this.showContent = true;
  }

  deleteCurrentEmail() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this email?!',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.beginLoading();
        this.historyService.deleteEmailById(this.emailId).subscribe({
          next: () => {
            this.popupMessageService.showSuccess('Email is deleted!');
            this.finishLoading();
            this.router.navigateByUrl('/history');
          },
          error: () => {
            this.popupMessageService.showFailed('Email is not deleted!');
            this.finishLoading();
          }
        })
      }
    });
  }

  retry() {
    this.beginLoading();
    this.historyService.retryFailed(this.emailId).subscribe({
      next: () => {
        this.popupMessageService.showSuccess("Successfully resent!");
        this.finishLoading();
        this.ngOnInit();
      },
      error: () => {
        this.finishLoading();
        this.popupMessageService.showFailed("Resending failed!");
      }
    });
  }

}



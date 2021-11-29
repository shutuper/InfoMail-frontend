import {Component, OnInit} from '@angular/core';
import {EmailService} from "../../../service/email.service";
import {NgForm} from "@angular/forms";
import {Email, EmailSchedule, Recipient, RecipientType, RepeatType} from "../../../model/email";
import {PopupMessageService} from "../../../service/utils/popup-message.service";

@Component({
  selector: 'app-new-email',
  templateUrl: './new-email.component.html',
  styleUrls: ['./new-email.component.css']
})
export class NewEmailComponent implements OnInit {

  emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  recipientsTO: string[] = [];
  recipientsCC: string[] = [];
  recipientsBCC: string[] = [];

  constructor(private emailService: EmailService, private popupMessageService: PopupMessageService) {
  }

  //for EmailEmailSchedule
  emailSchedule: EmailSchedule = {sendNow: true} as EmailSchedule
  isSendNow: boolean = true;

  switchScheduleFormHidden() {
    this.isSendNow = !this.isSendNow;
  }

  updateEmailShedule(schedule: EmailSchedule){
    this.emailSchedule = schedule;
    console.log('updateEmailShedule', this.emailSchedule)
  }

  public onSendEmail(emailForm: NgForm): void {
    console.log('email form', emailForm.value);

    const email = this.parseForm(emailForm);

    email.emailSchedule = (this.isSendNow) ? {sendNow: true} as EmailSchedule : this.emailSchedule;
    console.log("email.emailSchedule", email.emailSchedule)

    console.log('created email', email);

    this.emailService.sendEmail(email);
    emailForm.reset();
  }

  public parseRecipients(inputEmails: string[] | null, type: RecipientType): Recipient[] {
    let recipients: Recipient[] = [];
    if (inputEmails === null)
      return recipients;

    inputEmails.forEach(inputEmail => {
      recipients.push(
        {
          email: inputEmail,
          recipientType: type
        } as Recipient
      )
    })
    return recipients;
  }

  public parseForm(emailForm: NgForm): Email {

    const email = {
      emailTemplate: {
        body: emailForm.value.emailBody,
        subject: emailForm.value.emailSubject
      },
      emailSchedule: {
        sendDateTime: emailForm.value.emailSendDate,
        repeatAt: RepeatType.NOTHING
      },
      recipients: [] as Recipient[]
    } as Email;

    const recipientsTO = this.parseRecipients(emailForm.value.recipientsEmailsTO, RecipientType.TO);
    email.recipients.push(...recipientsTO);

    const recipientsCC = this.parseRecipients(emailForm.value.recipientsEmailsCC, RecipientType.CC);
    email.recipients.push(...recipientsCC);

    const recipientsBCC = this.parseRecipients(emailForm.value.recipientsEmailsBCC, RecipientType.BCC);
    email.recipients.push(...recipientsBCC);
    return email;
  }

  ngOnInit(): void {
  }

  validateRecipients(recipients: string[]): string[] {
    console.log(recipients);
    let len = recipients.length;

    if (!recipients[len - 1].match(this.emailRegex)) {
      recipients = recipients.slice(0, len - 1);
      this.popupMessageService.showFailed('Email is not valid!');
    }
    return recipients;
  }

  validateRecipientsTO() {
    this.recipientsTO = this.validateRecipients(this.recipientsTO);
  }

  validateRecipientsCC() {
    this.recipientsCC = this.validateRecipients(this.recipientsCC);
  }

  validateRecipientsBCC() {
    this.recipientsBCC = this.validateRecipients(this.recipientsBCC);
  }

}

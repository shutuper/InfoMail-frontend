import {Component} from '@angular/core';
import {NgForm} from "@angular/forms";
import {Email, Recipient, RecipientType, RepeatType} from "../../model/email";
import {EmailService} from "../../service/email.service";

@Component({
  selector: 'app-email-form',
  templateUrl: './email-form.component.html',
  styleUrls: ['./email-form.component.css']
})
export class EmailFormComponent {

  constructor( private emailService: EmailService){}

  displayModal!: boolean;
  isScheduleFormHidden!: boolean;
  isEnableSchedule!: boolean;

  public switchScheduleFormHidden() {
    this.isScheduleFormHidden = !this.isScheduleFormHidden;
  }

  public showModalDialog(emailForm: NgForm) {
    this.isEnableSchedule = false;
    this.isScheduleFormHidden = true;
    emailForm.reset();
    this.displayModal = true;
  }

  public onSendEmail(emailForm: NgForm): void {
    this.displayModal = false;
    console.log('email form', emailForm.value);

    const email = this.parseForm(emailForm);
    if(this.isScheduleFormHidden) email.emailSchedule.sendNow = true;
    console.log('created email', email);

    this.emailService.sendEmail(email);
    emailForm.reset();
  }

  public parseRecipients(inputEmails: string[] | null, type: RecipientType): Recipient[] {
    let recipients: Recipient[] = [];
    if(inputEmails === null) return recipients;

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
    recipientsTO.forEach(rec => email.recipients.push(rec));

    const recipientsCC = this.parseRecipients(emailForm.value.recipientsEmailsCC, RecipientType.CC);
    recipientsCC.forEach(rec => email.recipients.push(rec));

    const recipientsBCC = this.parseRecipients(emailForm.value.recipientsEmailsBCC, RecipientType.BCC);
    recipientsBCC.forEach(rec => email.recipients.push(rec));

    return email;
  }

}

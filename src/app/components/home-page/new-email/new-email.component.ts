import {Component, OnInit} from '@angular/core';
import {EmailService} from "../../../service/email.service";
import {FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {Email, Recipient, RecipientType, RepeatType} from "../../../model/email";
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
  isShowScheduleForm: boolean = false;

  emailForm: FormGroup = new FormGroup({
    emailTemplate: new FormGroup({
      body: new FormControl(''),
      subject: new FormControl('')
    }),
    recipients: new FormGroup({
      recipientsTO: new FormControl([], [Validators.email]),
      recipientsCC: new FormControl([], Validators.email),
      recipientsBCC: new FormControl([], Validators.email)
    }),
    isSendNotNowControl: new FormControl(this.isShowScheduleForm)
  });

  constructor(private emailService: EmailService, private popupMessageService: PopupMessageService) {
  }

  switchShowScheduleForm() {
    this.isShowScheduleForm = !this.isShowScheduleForm;
    this.emailForm.patchValue({isSendNowControl: this.isShowScheduleForm});
  }


  public onSendEmail(): void {
    console.log('emailForm', this.emailForm.value);

    // const email = this.parseForm(emailForm);
    //
    // email.emailSchedule = (this.isSendNow) ? {sendNow: true} as EmailSchedule : this.emailSchedule;
    // console.log("email.emailSchedule", email.emailSchedule)
    //
    // console.log('created email', email);
    //
    // this.emailService.sendEmail(email);
    // emailForm.reset();
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

  validateRecipients(controleName: string) {
    let recipients:string[] = this.emailForm.controls['recipients'].value[controleName];
    console.log("validateRecipients recipients: ", recipients);

    let len = recipients.length;
    if (!recipients[len - 1].match(this.emailRegex)) {
      recipients = recipients.slice(0, len - 1);
      this.popupMessageService.showFailed('Email is not valid!');
    }

    this.emailForm.patchValue({recipients: {
      [controleName]: recipients
    }});
  }

}

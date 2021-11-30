import {Component, OnInit} from '@angular/core';
import {EmailService} from "../../../service/email.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Email, EmailSchedule, Recipient, RecipientType, TemplateAsOption} from "../../../model/email";
import {PopupMessageService} from "../../../service/utils/popup-message.service";
import {UserEmailTemplateService} from "../../../service/user-email-template.service";

@Component({
  selector: 'app-new-email',
  templateUrl: './new-email.component.html',
  styleUrls: ['./new-email.component.css']
})
export class NewEmailComponent implements OnInit {

  emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  usedExistedTemplate = false;
  showTemplatesOptions = false;
  templatesAsOptions: TemplateAsOption[] = [] as TemplateAsOption[];

  recipientsTO: string[] = [];
  recipientsCC: string[] = [];
  recipientsBCC: string[] = [];

  emailForm: FormGroup = new FormGroup({
    emailTemplate: new FormGroup({
      id: new FormControl(''),
      body: new FormControl(''),
      subject: new FormControl('')
    }),
    recipients: new FormGroup({
      recipientsTO: new FormControl([], [Validators.email]),
      recipientsCC: new FormControl([], Validators.email),
      recipientsBCC: new FormControl([], Validators.email)
    }),
    isSendNotNow: new FormControl(false)
  });

  constructor(private emailService: EmailService,
              private popupMessageService: PopupMessageService,
              private userEmailTemplateService: UserEmailTemplateService) {
  }

  ngOnInit(): void {
    this.usedExistedTemplate = false;
    this.userEmailTemplateService.getAllAsOptions().subscribe({
      next: (templates) => {
        this.templatesAsOptions = templates.sort(
          (a, b) => b.id - a.id); // desc order by id
        this.showTemplatesOptions = true;
      },
      error: () => {
        this.showTemplatesOptions = false;
      }
    })
  }


  switchShowScheduleForm() {
    this.emailForm.patchValue({isSendNowControl: !this.isShowScheduleForm()});
  }

  useExistedTemplate() {
    this.usedExistedTemplate = !this.usedExistedTemplate;
  }

  isShowScheduleForm(): boolean {
    let isSendNotNow = this.emailForm.controls['isSendNotNow'].value
    return (isSendNotNow === null) ? false : isSendNotNow;
  }

  public onSendEmail(): void {
    console.log('emailForm', this.emailForm.value);

    const email: Email = this.parseForm();
    console.log('parsed email', email);

    this.emailService.sendEmail(email);
    this.emailForm.reset();
  }

  public convertToRecipients(inputEmails: string[] | null, type: RecipientType): Recipient[] {
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

  public parseEmailSchedule(): EmailSchedule {
    if (!this.emailForm.controls['emailSchedule'] || this.emailForm.controls['isSendNotNow'].value === null) {
      return {sendNow: true} as EmailSchedule;
    }

    const emailScheduleControl = this.emailForm.controls['emailSchedule'].value;
    const isSendNow: boolean = !this.emailForm.controls['isSendNotNow'].value;

    return {
      sendNow: isSendNow,

      sendDateTime: emailScheduleControl.sendDateTime,
      endDate: emailScheduleControl.endDate,
      repeatAt: emailScheduleControl.repeatAt,
    } as EmailSchedule

  }

  public parseForm(): Email {

    const emailTemplate = this.emailForm.controls['emailTemplate'].value;
    const emailSchedule = this.parseEmailSchedule();

    const email: Email = {
      emailTemplate: {
        body: emailTemplate.body,
        subject: emailTemplate.subject
      },
      emailSchedule: emailSchedule,
      recipients: [] as Recipient[]
    } as Email;

    const recipientsToControl: string[] = this.emailForm.controls['recipients'].value['recipientsTO'];
    const recipientsTO = this.convertToRecipients(recipientsToControl, RecipientType.TO);
    email.recipients.push(...recipientsTO);

    let recipientsCcControl: string[] = this.emailForm.controls['recipients'].value['recipientsCC'];
    const recipientsCC = this.convertToRecipients(recipientsCcControl, RecipientType.CC);
    email.recipients.push(...recipientsCC);

    let recipientsBccControl: string[] = this.emailForm.controls['recipients'].value['recipientsBCC'];
    const recipientsBCC = this.convertToRecipients(recipientsBccControl, RecipientType.BCC);
    email.recipients.push(...recipientsBCC);

    return email;
  }

  validateRecipients(controleName: string) {
    let recipients: string[] = this.emailForm.controls['recipients'].value[controleName];
    console.log("validateRecipients recipients: ", recipients);

    let len = recipients.length;
    if (!recipients[len - 1].match(this.emailRegex)) {
      recipients = recipients.slice(0, len - 1);
      this.popupMessageService.showFailed('Email is not valid!');
    }

    this.emailForm.patchValue({
      recipients: {
        [controleName]: recipients
      }
    });
  }

}

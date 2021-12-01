import {Component, OnInit} from '@angular/core';
import {EmailService} from "../../../service/email.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Email, EmailSchedule, EmailTemplate, Recipient, RecipientType, TemplateAsOption} from "../../../model/email";
import {PopupMessageService} from "../../../service/utils/popup-message.service";
import {UserEmailTemplateService} from "../../../service/user-email-template.service";
import {AngularEditorConfig} from "@kolkov/angular-editor";

@Component({
  selector: 'app-new-email',
  templateUrl: './new-email.component.html',
  styleUrls: ['./new-email.component.css']
})
export class NewEmailComponent implements OnInit {

  emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  usedExistedTemplate = false;
  showTemplatesOptions = false;
  showContent = false;
  isSelectNotEnabled = false;
  selectedTemplate!: TemplateAsOption;
  templatesAsOptions!: TemplateAsOption[];

  selectedId: number = -1;
  subject: string = {} as string;
  body: string = {} as string;

  recipientsTO: string[] = [];
  recipientsCC: string[] = [];
  recipientsBCC: string[] = [];

  editorConfig: AngularEditorConfig = {
    editable: true,
    minHeight: '200px',
    toolbarHiddenButtons: [['insertImage', 'insertVideo']]
  }


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
    isSendNotNow: new FormControl(false)
  });

  constructor(private emailService: EmailService,
              private popupMessageService: PopupMessageService,
              private userEmailTemplateService: UserEmailTemplateService) {
  }

  ngOnInit(): void {
    this.beginLoading();
    this.initialize();
    this.emailForm.reset();
    this.userEmailTemplateService.getAllAsOptions().subscribe({
      next: (templates) => {
        this.templatesAsOptions = templates.sort(
          (a, b) => b.id - a.id); // desc order by id
        console.log(templates)
        this.showTemplatesOptions = true;
        this.finishLoading();
      },
      error: () => {
        this.showTemplatesOptions = false;
        this.finishLoading();
      }
    })
  }

  initialize() {
    this.usedExistedTemplate = false;
    this.showTemplatesOptions = false;
    this.showContent = false;
    this.isSelectNotEnabled = false;
    this.selectedTemplate = {} as TemplateAsOption;
    this.templatesAsOptions = [] as TemplateAsOption[];
    this.selectedId = -1;
    this.subject = {} as string;
    this.body = {} as string;
    this.recipientsTO = [];
    this.recipientsCC = [];
    this.recipientsBCC = [];

  }

  beginLoading() {
    this.showContent = false;
  }

  finishLoading() {
    this.showContent = true;
  }

  enableSelect() {
    this.isSelectNotEnabled = false;
  }

  disableSelect() {
    this.isSelectNotEnabled = true;
  }

  switchShowScheduleForm() {
    this.emailForm.patchValue({isSendNowControl: !this.isShowScheduleForm()});
  }

  useExistedTemplate() {
    return this.usedExistedTemplate = !this.usedExistedTemplate;
  }

  isShowScheduleForm(): boolean {
    let isSendNotNow = this.emailForm.controls['isSendNotNow'].value
    return (isSendNotNow === null) ? false : isSendNotNow;
  }

  public onSendEmail(): void {
    this.beginLoading()
    console.log('emailForm', this.emailForm.value);

    const email: Email = this.parseForm();
    console.log('parsed email', email);

    this.emailService.sendEmail(email).subscribe({
      next: (response) => {
        console.log(response);
        this.ngOnInit();
        this.popupMessageService.showSuccess('Created successfully!');
      }, error: () => {
        this.ngOnInit();
        this.popupMessageService.showFailed('Email is not created!');
      }
    });
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

  private parseForm(): Email {

    const emailTemplate = this.emailForm.controls['emailTemplate'].value;
    const emailSchedule = this.parseEmailSchedule();
    let parsedEmailTemplate;

    if (this.selectedId >= 0 && this.usedExistedTemplate) {
      if ((this.subject !== emailTemplate.subject) || (this.body !== emailTemplate.body))
        parsedEmailTemplate = {
          body: emailTemplate.body,
          subject: emailTemplate.subject
        }
      else
        parsedEmailTemplate = {
          id: this.selectedId
        } as EmailTemplate
    } else {
      parsedEmailTemplate = {
        body: emailTemplate.body,
        subject: emailTemplate.subject
      }
    }

    console.log(parsedEmailTemplate);

    const email: Email = {
      emailTemplate: parsedEmailTemplate,
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

  validateRecipients(controlName: string) {
    let recipients: string[] = this.emailForm.controls['recipients'].value[controlName];
    console.log("validateRecipients recipients: ", recipients);

    let len = recipients.length;
    if (!recipients[len - 1].match(this.emailRegex)) {
      recipients = recipients.slice(0, len - 1);
      this.popupMessageService.showFailed('Email is not valid!');
    }

    this.emailForm.patchValue({
      recipients: {
        [controlName]: recipients
      }
    });
  }

  changeTemplate(selectedId: number) {
    this.disableSelect()
    this.userEmailTemplateService.getTemplateById(selectedId).subscribe({
      next: (template) => {
        this.selectedId = selectedId;
        this.subject = template.subject;
        this.body = template.body;

        this.emailForm.patchValue({
          emailTemplate: {
            ['subject']: this.subject
          }
        });
        this.emailForm.patchValue({
          emailTemplate: {
            ['body']: this.body
          }
        });

      },
      error: () => {
        this.popupMessageService.showFailed("Selected email isn't loaded!");

      }, complete: () => this.enableSelect()

    })
  }
}

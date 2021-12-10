import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AngularEditorConfig} from "@kolkov/angular-editor";
import {EmailTemplate} from "../../../model/email";
import {UserEmailTemplateService} from "../../../service/user-email-template.service";
import {PopupMessageService} from "../../../service/utils/popup-message.service";

@Component({
  selector: 'app-template-view',
  templateUrl: './template-view.component.html',
  styleUrls: ['./template-view.component.css']
})
export class TemplateViewComponent implements OnInit {

  @Output()
  onSuccess: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  onError: EventEmitter<any> = new EventEmitter<any>();

  loading: boolean = false;    // show loading
  private _mode: TemplateViewMod = TemplateViewMod.READ;
  private _templateId: number = -1;
  private _sharingId: string = '';
  private templateCopy: EmailTemplate = {} as EmailTemplate;

  SHARING_LINK: string = "http://localhost:4200/shared-templates/";

  get templateId(): number {
    return this._templateId;
  }

  @Input()
  set templateId(value: number) {
    this._templateId = value;
    console.log('templateId changes to :', value)
    if(value == -1) return;
    else this.setTemplateById(value);
  }

  get sharingId(): string {
    return this._sharingId;
  }

  @Input()
  set sharingId(value: string) {
    this._sharingId = value;
    console.log('sharingId changes to :', value)
    if(value == '') return;
    else this.setTemplateBySharingId(value);
  }

  get mode(): TemplateViewMod {
    return this._mode;
  }

  @Input()
  set mode(value: TemplateViewMod) {
    this._mode = value;
    console.log('mode changes to :', value)
    this.whenModeChange(value);
  }

  form: FormGroup = new FormGroup({
    userEmail: new FormControl(''),
    sharingLink: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    body: new FormControl('', [Validators.required]),
    subject: new FormControl('', [Validators.required]),
  });

  get userEmail() { return this.form.get('userEmail'); }
  get sharingLink() { return this.form.get('sharingLink'); }
  get name() { return this.form.get('name'); }
  get body() { return this.form.get('body'); }
  get subject() { return this.form.get('subject'); }

  editConfig: AngularEditorConfig = {
    showToolbar: true,
    editable: true,
    minHeight: '200px',
    placeholder: "Template body"
  }

  readConfig: AngularEditorConfig = {
    showToolbar: false,
    editable: false,
    minHeight: '200px',
    placeholder: "Template body"
  }

  constructor(
    private templateService: UserEmailTemplateService,
    private popupMessageService: PopupMessageService,
  ) { }

  ngOnInit(): void {
    this.whenModeChange(this.mode)
  }


  copySharingLink() {
    const sharingLink: string = this.form.value.sharingLink;
    if(sharingLink == '' ) return;

    console.log('sharingLink', sharingLink)

    const listener = (e: ClipboardEvent) => {
      // @ts-ignore
      e.clipboardData.setData('text/plain', (sharingLink));
      e.preventDefault();
    };

    document.addEventListener('copy', listener);
    document.execCommand('copy');
    document.removeEventListener('copy', listener);

    this.popupMessageService.showSuccess('Sharing link copied to clipboard!');
    console.log("share link copied to clipboard");
  }

  whenModeChange(mode: TemplateViewMod) {
    console.log("whenModeChange to:", mode);
    switch (mode) {
      case TemplateViewMod.EDIT: {
        this.form?.enable();
        break;
      }
      case TemplateViewMod.NEW: {
        this.form?.enable();
        this.userEmail?.disable();
        this.sharingLink?.disable();
        break;
      }
      case TemplateViewMod.READ: {
        this.form?.disable();
        break;
      }
    }
  }

  showValidity(controleName: string): boolean {
    return this.form.controls[controleName].invalid && this.form.controls[controleName].dirty;
  }

  isEditMode():boolean {
    return this.mode == TemplateViewMod.EDIT;
  }

  isReadMode():boolean {
    return this.mode == TemplateViewMod.READ;
  }

  isCreateNewMode():boolean {
    return this.mode == TemplateViewMod.NEW;
  }

  restoreTemplate() {
    console.log('restoreTemplate')
    this.form.patchValue({...this.templateCopy});
  }

  setTemplateById(id: number) {
    console.log('setTemplateById', id)
    this.beginLoading();
    this.templateService.getTemplateById(id).subscribe({
      next: (template) => {
        if (template.sharingLink) template.sharingLink = this.setFullLink(template.sharingLink);

        this.templateCopy = {...template};
        this.form.patchValue({...template});
      },
      error: () => {
        this.popupMessageService.showFailed("Couldn't load template!");
        this.onError.emit();
      },
      complete: () => this.finishLoading()
    });
  }

  private setTemplateBySharingId(sharingId: string) {
    console.log('setTemplateBySharingId', sharingId);
    this.beginLoading();
    this.templateService.getTemplateBySharingId(sharingId).subscribe({
      next: (template) => {
        if (template.sharingLink) template.sharingLink = this.setFullLink(template.sharingLink);
        this.form.patchValue({...template});
      },
      error:() => {
        this.popupMessageService.showFailed("Couldn't load template!");
        this.onError.emit();
      },
      complete: () => this.finishLoading()
    });
  }

  setFullLink(sharingId: string) {
    return this.SHARING_LINK + sharingId;
  }

  updateTemplate() {
    if (this.form.invalid) {
      this.popupMessageService.showFailed('Template invalid!');
      return;
    }

    const template: EmailTemplate = this.parseForm();
    template.id = this.templateId;

    this.beginLoading();
    this.templateService.saveTemplate(template).subscribe({
      next: () => {
        this.onSuccess.emit();
        this.form.reset();
        this.popupMessageService.showSuccess('Template successfully updated!');
      },
      error: () => this.popupMessageService.showFailed('Template is not updated!'),
      complete: () => this.finishLoading()
    });
  }

  saveTemplate():void {
    if (this.form.invalid) {
      this.popupMessageService.showFailed('Template invalid!');
      return;
    }

    const template: EmailTemplate = this.parseForm();

    this.beginLoading();
    this.templateService.saveTemplate(template).subscribe({
      next: () => {
        this.onSuccess.emit();
        this.form.reset();
        this.popupMessageService.showSuccess('Template successfully saved!');
      },
      error: () => this.popupMessageService.showFailed('Template is not saved!'),
      complete: () => this.finishLoading()
    });
  }

  private parseForm(): EmailTemplate {
    const emailTemplate = this.form.value;
    return {
      name: emailTemplate.name,
      body: emailTemplate.body,
      subject: emailTemplate.subject
    } as EmailTemplate;
  }

  private beginLoading() {
    this.loading = true;
  }

  private finishLoading() {
    this.loading = false;
  }
}

export enum TemplateViewMod {
  EDIT,
  READ,
  NEW
}

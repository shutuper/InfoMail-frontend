import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AngularEditorConfig} from "@kolkov/angular-editor";

@Component({
  selector: 'app-template-view2',
  templateUrl: './template-view2.component.html',
  styleUrls: ['./template-view2.component.css']
})
export class TemplateView2Component implements OnInit {


  private _mode: TemplateViewMod = TemplateViewMod.NEW;
  private _templateId: number = -1;
  private _sharingId: string = '';

  get templateId(): number {
    return this._templateId;
  }

  @Input()
  set templateId(value: number) {
    this._templateId = value;
    console.log('templateId changes to :', value)
  }

  get sharingId(): string {
    return this._sharingId;
  }

  @Input()
  set sharingId(value: string) {
    this._sharingId = value;
    console.log('sharingId changes to :', value)
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
  ) { }

  ngOnInit(): void {
  }


  copySharingLink() {

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

  onSubmit() {

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

  }

  updateTemplate() {

  }

  saveTemplate() {

  }
}

export enum TemplateViewMod {
  EDIT,
  READ,
  NEW
}

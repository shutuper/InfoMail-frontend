import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EmailTemplate} from "../../../model/email";

@Component({
  selector: 'app-template-view',
  templateUrl: './template-view.component.html',
  styleUrls: ['./template-view.component.css']
})
export class TemplateViewComponent implements OnInit {

  //accept to edit values
  @Input() isEdit: boolean = false;

  @Input() template: EmailTemplate = {
    name: '',
    subject: '',
    body: '',
  } as EmailTemplate
  @Output() templateChange = new EventEmitter<EmailTemplate>()
  // @Output() onEditTemplate = new EventEmitter<EmailTemplate>();

  constructor() { }

  ngOnInit(): void {
  }


  // saveChanges() {
  //   this.onEditTemplate.emit(this.template);
  // }

  rollbackChanges() {

  }
}

import {Component, Input, OnInit} from '@angular/core';
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

  constructor() { }

  ngOnInit(): void {
  }

}

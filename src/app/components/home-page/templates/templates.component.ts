import {Component, OnInit} from '@angular/core';
import {EmailTemplate} from "../../../model/email";
import {TemplateService} from "../../../service/template.service";
import {PopupMessageService} from "../../../service/utils/popup-message.service";
import {ConfirmationService} from "primeng/api";

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css']
})
export class TemplatesComponent implements OnInit {

  templates: EmailTemplate[] = [];
  template!: EmailTemplate;
  selectedTemplates: EmailTemplate[] = [];

  constructor(
    private templateService: TemplateService,
    private popupMessageService: PopupMessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.getTemplates();
  }

  getTemplates() {
    this.templateService.getTemplates().subscribe({
      next: (templates) => this.templates = templates,
      error:() => this.popupMessageService.showFailed("Couldn't load templates!")
    });
  }


  deleteTemplate(template: EmailTemplate) {
    console.log("deleteTemplate: ", template);
    this.templateService.deleteEmailTemplateById(template.id).subscribe({
      next: () => {
        this.popupMessageService.showSuccess('Template is deleted!');
        this.templates = this.templates.filter(val => val.id !== template.id);
      },
      error: () => this.popupMessageService.showFailed('Template is not deleted!')
    })
  }

  editTemplate(template: EmailTemplate) {
    console.log("editTemplate: ", template);
  }

  sliceText(text: string, maxLength: number): string {
    return (text.length >= maxLength) ? (text.slice(0, maxLength) + '...') : text;
  }

  deleteSelectedTemplates() {
    console.log("deleteSelectedTemplates: ", this.selectedTemplates);
    let selected = this.selectedTemplates;
    let ids = selected.map(x => x.id);  // get array of selected emails' ids
    this.templateService.deleteEmailTemplatesByIds(ids).subscribe({
      next: () => {
        this.templates = this.templates.filter(val => !selected.includes(val));
        this.selectedTemplates = [];
        this.popupMessageService.showSuccess('Templates are deleted!');
      },
      error: () => {
        this.selectedTemplates = [];
        this.popupMessageService.showFailed("Couldn't delete selected templates!");
      }
    });
  }
}

import {Component, OnInit} from '@angular/core';
import {EmailTemplate} from "../../../model/email";
import {TemplateService} from "../../../service/template.service";

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css']
})
export class TemplatesComponent implements OnInit {

  templates: EmailTemplate[] = [];

  constructor(private templateService: TemplateService) { }

  ngOnInit(): void {
    this.getTemplates();
  }

  getTemplates() {
    this.templateService.getTemplates().subscribe(templates => this.templates = templates);
  }


  deleteProduct(template: EmailTemplate) {

  }

  editProduct(template: EmailTemplate) {

  }

  sliceText(text: string, maxLength: number): string {
    return (text.length >= maxLength) ? (text.slice(0, maxLength) + '...') : text;
  }
}

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
  //vars for table
  templates: EmailTemplate[] = [];
  template!: EmailTemplate;
  selectedTemplates: EmailTemplate[] = [];
  isShowLoading: boolean = true; // show loading before templates loaded

  //vars for template dialog
  isShowTemplateDialog: boolean = false;
  dialogHeader: string = '';
  //vars for template view
  isEditMod: boolean = false;
  editTemplate: EmailTemplate = {} as EmailTemplate;
  editTemplateCopy: EmailTemplate = {} as EmailTemplate;

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
      error:() => this.popupMessageService.showFailed("Couldn't load templates!"),
      complete:() => this.isShowLoading = false
    });
  }

  getTemplateById(id: number) {
    console.log('getTemplateById', id)
    this.templateService.getTemplateById(id).subscribe({
      next: (template) => {
        this.editTemplate = {...template};
        this.editTemplateCopy = {...template};

        this.updateBufferValue(template);
      },
      error:() => this.popupMessageService.showFailed("Couldn't load template!")
    });
  }

  openEditTemplateDialog(template: EmailTemplate) {
    console.log('openViewTemplateDialog')
    this.getTemplateById(template.id);
    this.isEditMod = true;
    this.dialogHeader = 'Edit template';
    this.isShowTemplateDialog = true;
    console.log("editTemplate: ", template);
  }

  openNewTemplateDialog() {
    console.log('openViewTemplateDialog')
    this.editTemplate = {} as EmailTemplate;
    this.editTemplateCopy = {} as EmailTemplate;
    this.isEditMod = true;
    this.dialogHeader = 'Create new template';
    this.isShowTemplateDialog = true;
  }

  openViewTemplateDialog(template: EmailTemplate) {
    console.log('openViewTemplateDialog')
    this.getTemplateById(template.id);
    this.isEditMod = false;
    this.isShowTemplateDialog = true;
    this.dialogHeader = 'Show template';
    console.log("showTemplate: ", template);
  }

  sliceText(text: string, maxLength: number): string {
    return (text.length >= maxLength) ? (text.slice(0, maxLength) + '...') : text;
  }

  deleteTemplate(template: EmailTemplate) {
    console.log("deleteTemplate: ", template);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete selected template?!',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.templateService.deleteEmailTemplateById(template.id).subscribe({
          next: () => {
            this.templates = this.templates.filter(val => val.id !== template.id);
            this.popupMessageService.showSuccess('Template is deleted!');
          },
          error: () => this.popupMessageService.showFailed('Template is not deleted!')
        });
      }
    });
  }

  deleteSelectedTemplates() {
    console.log("deleteSelectedTemplates: ", this.selectedTemplates);
    let selected = this.selectedTemplates;
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected templates?!',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
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
    });

  }

  saveTemplate():void {
    if(! this.isValidTemplate()) {
      this.popupMessageService.showFailed('Template invalid!');
      return;
    }

    if(this.editTemplate.id) return this.updateTemplate();

    console.log("saveTemplate", this.editTemplate);

    this.templateService.saveTemplate(this.editTemplate).subscribe({
      next: (template) => {
        this.templates = [...this.templates, template];
        this.isShowTemplateDialog = false;
        this.popupMessageService.showSuccess('Template successfully saved!');
      },
      error: () => this.popupMessageService.showFailed('Template is not saved!')
    });
  }

  isValidTemplate():boolean {
    if(this.editTemplate.name === undefined || this.editTemplate.name === '') return false;
    if(this.editTemplate.subject === undefined || this.editTemplate.subject === '') return false;
    if(this.editTemplate.body === undefined || this.editTemplate.body === '') return false;
    return true;
  };

  updateTemplate() {
    console.log("updateTemplate", this.editTemplate);

    this.templateService.saveTemplate(this.editTemplate).subscribe({
      next: (template) => {
        this.updateBufferValue(template);

        this.isShowTemplateDialog = false;
        this.popupMessageService.showSuccess('Template successfully updated!');
      },
      error: () => this.popupMessageService.showFailed('Template is not updated!')
    });

  }

  updateBufferValue(template: EmailTemplate) {
    this.templates.map((oldTemplate, index) => {
      if (oldTemplate.id == template.id){
        this.templates[index] = template;
      }
    });
  }

  restoreTemplate() {
    console.log('restoreTemplate')
    this.editTemplate = {...this.editTemplateCopy};

    console.log('this.editTemplate', this.editTemplate)
    console.log('this.editTemplateCopy', this.editTemplateCopy)

    console.log("template restored")
  }
}

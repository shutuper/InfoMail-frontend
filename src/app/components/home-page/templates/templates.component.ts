import {Component, OnInit} from '@angular/core';
import {EmailTemplate} from "../../../model/email";
import {UserEmailTemplateService} from "../../../service/user-email-template.service";
import {PopupMessageService} from "../../../service/utils/popup-message.service";
import {ConfirmationService, LazyLoadEvent} from "primeng/api";
import {TemplateViewMod} from "../template-view/template-view.component";

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css']
})
export class TemplatesComponent implements OnInit {
  //vars for table
  templates: EmailTemplate[] = [];
  selectedTemplates: EmailTemplate[] = [];
  loading: boolean = true;    // show loading before templates loaded
  numberOfRows = 10;
  totalRecords: number = 0;   // total number of templates in history
  firstLoad: boolean = true;  // marker for sorting by templates Ids (for first load)
  isChecked: boolean = false; // is all templates selected
  sortField: string = 'id';   //default sort field
  sortOrder: number = -1;     //default sort order

  //vars for template dialog
  isShowTemplateDialog: boolean = false;
  dialogHeader: string = '';

  //vars for template view
  mode: TemplateViewMod = TemplateViewMod.READ;
  templateId: number = -1;

  constructor(
    private templateService: UserEmailTemplateService,
    private popupMessageService: PopupMessageService,
    private confirmationService: ConfirmationService
  ) {
  }

  ngOnInit(): void {
    this.beginLoading();
    this.setTotalNumberOfRows();
    this.getCurrentTemplatePage(0, this.numberOfRows, 'id', -1);
  }

  selectOrUnselectAllTemplates() {
    this.selectedTemplates = this.isChecked ? this.templates : [];
  }

  private getCurrentTemplatePage(page: number, rows: number, sortFiled: string, sortOrder: number) {
    this.templateService.getPaginatedTemplates(page, rows, sortFiled, sortOrder).subscribe({
      next: (templates: EmailTemplate[]) => {
        this.templates = templates
        this.finishLoading();
      },
      error: () => {
        setTimeout(() => {
          this.popupMessageService.showFailed("Couldn't load templates!");
          this.finishLoading();
          this.getCurrentTemplatePage(0, this.numberOfRows, 'id', -1);
        }, 5 * 1000)  // if failed to load data, recursively try to load templates after 5 seconds
      }
    });
  }

  private beginLoading() {
    this.loading = true;
  }

  private finishLoading() {
    this.loading = false;
  }

  private setTotalNumberOfRows() {
    this.templateService.getTotalNumberOfRows().subscribe(totalRecords => {
      this.totalRecords = totalRecords;
      console.log("setTotalNumberOfRows", totalRecords);
    });
  }

  loadTemplates(event: LazyLoadEvent) {  //loading templates after changing page/sorter
    console.log(event);
    if (event.rows) {
      this.beginLoading();

      let page = ((!event.first) ? 0 : event.first) / event.rows;
      this.sortField = (!event.sortField) ? 'id' : event.sortField;
      this.sortOrder = (!event.sortOrder) ? -1 : event.sortOrder;

      if (this.firstLoad || (this.sortField === 'id')) {  //default sorting by emails ids
        this.firstLoad = false;
        this.sortOrder = -1;
      }

      window.scrollTo(0, 0); // jump to top of the page before loading new content
      this.getCurrentTemplatePage(page, event.rows, this.sortField, this.sortOrder);
    }
  }

  openEditTemplateDialog(template: EmailTemplate) {
    console.log('openViewTemplateDialog')

    this.mode = TemplateViewMod.EDIT;
    this.templateId = template.id;

    this.dialogHeader = 'Edit template';
    this.isShowTemplateDialog = true;
  }

  openNewTemplateDialog() {
    console.log('openViewTemplateDialog')

    this.mode = TemplateViewMod.NEW;
    this.templateId = -1;

    this.dialogHeader = 'Create new template';
    this.isShowTemplateDialog = true;
  }

  openViewTemplateDialog(template: EmailTemplate) {
    console.log('openViewTemplateDialog')

    this.mode = TemplateViewMod.READ;
    this.templateId = template.id;

    this.isShowTemplateDialog = true;
    this.dialogHeader = 'Email template';
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
        this.beginLoading();
        this.templateService.deleteEmailTemplateById(template.id).subscribe({
          next: () => {
            this.totalRecords--;
            this.isChecked = false;
            this.selectedTemplates = [];
            this.getCurrentTemplatePage(0, this.numberOfRows, this.sortField, this.sortOrder);

            this.finishLoading();
            this.popupMessageService.showSuccess('Template is deleted!');
          },
          error: () => {
            this.finishLoading();
            this.popupMessageService.showFailed('Template is not deleted!');
          }
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
        this.beginLoading();
        this.templateService.deleteEmailTemplatesByIds(ids).subscribe({
          next: () => {
            // this.templates = this.templates.filter(val => !selected.includes(val));
            this.totalRecords -= selected.length;
            this.isChecked = false;
            this.selectedTemplates = [];
            this.getCurrentTemplatePage(0, this.numberOfRows, this.sortField, this.sortOrder);

            this.finishLoading();
            this.popupMessageService.showSuccess('Templates are deleted!');
          },
          error: () => {
            this.finishLoading();
            this.popupMessageService.showFailed("Couldn't delete selected templates!");
          }
        });
      }
    });

  }

  closeTemplateDialog(): void {
    this.beginLoading();

    this.isChecked = false;
    this.selectedTemplates = [];
    this.setTotalNumberOfRows();
    this.getCurrentTemplatePage(0, this.numberOfRows, this.sortField, this.sortOrder);

    this.isShowTemplateDialog = false;

    this.finishLoading();
  }
}

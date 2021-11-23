import {Component, OnInit} from '@angular/core';
import {ConfirmationService, LazyLoadEvent} from "primeng/api";
import {HistoryService} from "../../../service/history.service";
import {History} from "../../../model/email";
import {PopupMessageService} from "../../../service/utils/popup-message.service";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  numberOfRows: number = 15; // default number of table rows
  totalRecords!: number;  // total number of emails in history
  loading: boolean = false; // icon of loading before emails loaded
  firstLoad: boolean = true; // marker for sorting by emails ids (for first load)
  isChecked: boolean = false; // all emails selected
  first: number = 0; // xz 3a4em yzhe ne nado naverno
  emails!: History[]; // all emails on current page (lazy loaded)
  selectedEmails: History[] = []; // emails selected by checkboxes


  constructor(private popupMessageService: PopupMessageService,
              private confirmationService: ConfirmationService,
              private historyService: HistoryService) {
  }

  ngOnInit() {
    this.loading = true;

    this.historyService.getTotalNumberOfRows().subscribe(totalRecords => this.totalRecords = totalRecords);

    this.getCurrentHistoryPage(0, this.numberOfRows, 'id', -1);
  }

  selectOrUnselectAllEmails() {
    if (this.isChecked)
      this.selectedEmails = this.emails;
    else
      this.selectedEmails = [];
  }

  sliceLongString(str: string){
    if (str.length>=65)
      return str.slice(0,64).concat('...');
    else
      return str;
  }

  private getCurrentHistoryPage(page: number, rows: number, sortFiled: string, sortOrder: number) {
    this.historyService.getPaginatedHistory(page, rows, sortFiled, sortOrder).subscribe({
      next: (emails: History[]) => {
        this.emails = emails;
        this.loading = false;
      },
      error: () => {
        setTimeout(() => {
          this.popupMessageService.showFailed("Couldn't load emails history!");
          this.loading = false;
          this.getCurrentHistoryPage(0, this.numberOfRows, 'id', -1);
        }, 5000)  // if failed to load data, recursively try to load emails after 5 seconds
      }
    });
  }

  loadEmails(event: LazyLoadEvent) {  //loading emails after changing page/sorter
    console.log(event);
    if (event.rows) {
      this.loading = true;

      let page = ((!event.first) ? 0 : event.first) / event.rows;
      let sortField = (!event.sortField) ? 'id' : event.sortField;
      let sortOrder = (!event.sortOrder) ? -1 : event.sortOrder;
      this.first = event.first || 0;

      if (this.firstLoad || (sortField === 'id')) {  //default sorting by emails ids
        this.firstLoad = false;
        sortOrder = -1;
      }

      window.scrollTo(0, 0); // jump to top of the page before loading new content
      this.getCurrentHistoryPage(page, event.rows, sortField, sortOrder);
    }
  }

  deleteSelectedEmails() {
    let selected = this.selectedEmails;
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected emails?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let ids = selected.map(x => x.id);  // get array of selected emails' ids
        this.historyService.deleteEmailsByIds(ids).subscribe({

            next: () => {
              this.emails = this.emails.filter(val => !selected.includes(val));
              this.getCurrentHistoryPage(0, this.numberOfRows, 'id', -1);

              this.isChecked = false;
              this.totalRecords -= selected.length;
              this.selectedEmails = [];
              this.popupMessageService.showSuccess('Products are deleted!');
            },
            error: () => {
              this.selectedEmails = [];
              this.popupMessageService.showFailed("Couldn't delete selected emails!");
            }
          }
        )
      }
    });
  }


  deleteEmailById(id: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete selected email?!',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.historyService.deleteEmailById(id).subscribe({
          next: () => {
            this.popupMessageService.showSuccess('Email is deleted!');
            this.emails = this.emails.filter(val => val.id !== id);
            this.totalRecords--;
          },
          error: () => this.popupMessageService.showFailed('Email is not deleted!')
        })
      }
    });
  }


}

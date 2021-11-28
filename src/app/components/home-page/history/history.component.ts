import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ConfirmationService, LazyLoadEvent} from "primeng/api";
import {HistoryService} from "../../../service/history.service";
import {ExecutedEmail} from "../../../model/email";
import {PopupMessageService} from "../../../service/utils/popup-message.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  selectedEmails: ExecutedEmail[] = [];   // emails selected by checkboxes
  isChecked: boolean = false;      // is all emails selected
  numberOfRows: number = 15;      // default number of table rows
  totalRecords!: number;         // total number of emails in history
  loading: boolean = false;     // icon of loading before actions completed
  firstLoad: boolean = true;   // marker for sorting by emails Ids (for first load)
  emails!: ExecutedEmail[];         // all emails on current page (lazy loaded)
  maxSubjectLength = 65;     // max subject length in table that is not sliced

  constructor(private popupMessageService: PopupMessageService,
              private confirmationService: ConfirmationService,
              private historyService: HistoryService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.beginLoading();
    this.historyService.getTotalNumberOfRows().subscribe(totalRecords => this.totalRecords = totalRecords);

    this.getCurrentHistoryPage(0, this.numberOfRows, 'id', -1);
  }

  selectOrUnselectAllEmails() {
    this.selectedEmails = this.isChecked ? this.emails : [];
  }

  sliceLongString(str: string, maxLength: number) {
    return (str.length >= maxLength) ? str.slice(0, maxLength - 1).concat('...') : str;
  }

  retry(emailId: number, index: number) {
    this.beginLoading();
    this.historyService.retryFailed(emailId).subscribe({
      next: (email: ExecutedEmail) => {
        this.emails.splice(index, 1, email);
        this.finishLoading();
        this.popupMessageService.showSuccess("Successfully resent!");
      },
      error: () => {
        this.finishLoading();
        this.popupMessageService.showFailed("Resending failed!");
      }
    });
  }

  private getCurrentHistoryPage(page: number, rows: number, sortFiled: string, sortOrder: number) {
    this.historyService.getPaginatedHistory(page, rows, sortFiled, sortOrder).subscribe({
      next: (emails: ExecutedEmail[]) => {
        this.emails = emails;
        this.finishLoading();
      },
      error: () => {
        setTimeout(() => {
          this.popupMessageService.showFailed("Couldn't load emails history!");
          this.finishLoading();
          this.getCurrentHistoryPage(0, this.numberOfRows, 'id', -1);
        }, 5 * 1000)  // if failed to load data, recursively try to load emails after 5 seconds
      }
    });
  }

  openEmailView(emailId: number) {
    this.router.navigate([emailId], {relativeTo: this.route});
  }

  loadEmails(event: LazyLoadEvent) {  //loading emails after changing page/sorter
    console.log(event);
    if (event.rows) {
      this.beginLoading();

      let page = ((!event.first) ? 0 : event.first) / event.rows;
      let sortField = (!event.sortField) ? 'id' : event.sortField;
      let sortOrder = (!event.sortOrder) ? -1 : event.sortOrder;

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
        this.beginLoading();
        this.historyService.deleteEmailsByIds(ids).subscribe({

            next: () => {
              this.emails = this.emails.filter(val => !selected.includes(val));
              if (this.emails.length <= 0)
                this.ngOnInit();

              this.isChecked = false;
              this.totalRecords -= selected.length;
              this.selectedEmails = [];
              this.finishLoading();
              this.popupMessageService.showSuccess('Products are deleted!');
            },
            error: () => {
              this.selectedEmails = [];
              this.finishLoading();
              this.popupMessageService.showFailed("Couldn't delete selected emails!");
            }
          }
        )
      }
    });
  }

  private beginLoading() {
    this.loading = true;
  }

  private finishLoading() {
    this.loading = false;
  }

  deleteEmailById(id: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete selected email?!',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.beginLoading();
        this.historyService.deleteEmailById(id).subscribe({
          next: () => {
            this.popupMessageService.showSuccess('Email is deleted!');
            this.emails = this.emails.filter(val => val.id !== id);
            this.totalRecords--;
            this.finishLoading();

            if (this.emails.length <= 0)
              this.ngOnInit();
          },
          error: () => {
            this.popupMessageService.showFailed('Email is not deleted!');
            this.finishLoading();
          }
        })
      }
    });
  }


}

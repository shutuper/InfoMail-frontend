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
  isChecked: boolean = false;            // is all emails selected
  numberOfRows: number = 15;            // default number of table rows
  totalRecords!: number;               // total number of emails in history
  loading: boolean = false;           // icon of loading before actions completed
  firstLoad: boolean = true;         // marker for sorting by emails Ids (for first load)
  emails!: ExecutedEmail[];         // all emails on current page (lazy loaded)
  maxSubjectLength = 65;           // max subject length in table that is not sliced

  constructor(private popupMessageService: PopupMessageService,
              private confirmationService: ConfirmationService,
              private historyService: HistoryService,
              private router: Router,
              private route: ActivatedRoute) {
  }


  /**
   *  Defines total number of rows on current page and
   *  loads current emails' page on the start of component
   *
   * */
  ngOnInit() {
    this.beginLoading();
    this.historyService.getTotalNumberOfRows().subscribe(totalRecords => this.totalRecords = totalRecords);

    this.getCurrentHistoryPage(0, this.numberOfRows, 'id', -1);
  }

  sliceLongString(str: string, maxLength: number) {
    return (str.length >= maxLength) ? str.slice(0, maxLength - 1).concat('...') : str;
  }

  /**
   * Try resending 'FAILED' email
   *
   * @param emailId - id of email that has 'FAILED' status and can be resent
   *
   * */
  resend(emailId: number) {
    this.beginLoading();
    this.historyService.retryFailed(emailId).subscribe({
      next: (email: ExecutedEmail) => {
        // @ts-ignore
        this.emails.find(em => em.id === emailId).status = email.status;
        this.popupMessageService.showSuccess("Successfully resent!");
      },
      error: () => {
        this.popupMessageService.showFailed("Resending failed!");
      },
      complete: () => this.finishLoading()
    });
  }

  /**
   *  Get current/selected page of emails
   *    if failed automatically retries after 5 seconds
   *
   *  @param page - number of current page
   *  @param rows - number of rows to load
   *  @param sortFiled - name of email filed, that will be filtered
   *  @param sortOrder - (-1) - descending, 1 - ascending order of sort
   *
   *  */
  private getCurrentHistoryPage(page: number, rows: number, sortFiled: string, sortOrder: number) {

    this.historyService.getPaginatedHistory(page, rows, sortFiled, sortOrder).subscribe({
      next: (emails: ExecutedEmail[]) => this.emails = emails,
      error: () => {
        setTimeout(() => {
          this.popupMessageService.showFailed("Couldn't load emails history!");
          this.getCurrentHistoryPage(0, this.numberOfRows, 'id', -1);
        }, 5 * 1000)  // if failed to load data, recursively try to load emails after 5 seconds

      },
      complete: () => this.finishLoading()
    });

  }

  /**
   * Opens view (description of selected email (by id)
   *
   * @param emailId - id of email, description of which that will be opened
   *
   * */
  openEmailView(emailId: number) {
    this.router.navigate([emailId], {relativeTo: this.route});
  }

  /**
   * Lazy load of emails when {@link event event} triggered
   *  then calls {@link getCurrentHistoryPage getCurrentHistoryPage}
   *    and move window to top of the page
   *
   *  @param event - LazyLoadEvent of p-table
   *
   * */
  loadEmails(event: LazyLoadEvent) {  //loading emails after changing page/sorter
    console.log(event);
    if (event.rows) {
      this.beginLoading();

      let page = ((!event.first) ? 0 : event.first) / event.rows;
      let sortField = (!event.sortField) ? 'id' : event.sortField;
      let sortOrder = this.initSortOrder(event, sortField);

      window.scrollTo(0, 0); // jump to top of the page before loading new content
      this.getCurrentHistoryPage(page, event.rows, sortField, sortOrder);
    }
  }

  /**
   * Setting sort order (asc/desc) of p-table
   *    (on first load sorts by emails' ids (desc))
   *
   * @param event - LazyLoadEvent of p-table
   * @param sortField - name of email filed, that will be filtered
   *
   * */
  private initSortOrder(event: LazyLoadEvent, sortField: string) {
    let sortOrder = (!event.sortOrder) ? -1 : event.sortOrder;

    if (this.firstLoad || (sortField === 'id')) {
      this.firstLoad = false;
      sortOrder = -1;
    }
    return sortOrder;
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
          next: () => this.hideDeletedEmail(selected),
          error: () => {
            this.selectedEmails = [];
            this.popupMessageService.showFailed("Couldn't delete selected emails!");
          },
          complete: () => this.finishLoading()
        })
      }
    });
  }

  private hideDeletedEmail(selected: ExecutedEmail[]) {
    this.emails = this.emails.filter(val => !selected.includes(val));
    this.isChecked = false;
    this.totalRecords -= selected.length;
    this.selectedEmails = [];
    this.popupMessageService.showSuccess('Products are deleted!');

    if (this.emails.length <= 0)
      this.ngOnInit();
  }

  /**
   * Shows p-table's spinner
   * */
  private beginLoading() {
    this.loading = true;
  }

  /**
   * Hides p-table's spinner
   * */
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

            if (this.emails.length <= 0)
              this.ngOnInit();
          },
          error: () => {
            this.popupMessageService.showFailed('Email is not deleted!');
          }, complete: () => this.finishLoading()
        })
      }
    });
  }


}

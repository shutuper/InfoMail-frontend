import {Component, OnInit} from '@angular/core';
import {ConfirmationService, LazyLoadEvent, MessageService} from "primeng/api";
import {HistoryService} from "../../../service/history.service";
import {History} from "../../../model/email";
import {TableHeaderCheckbox} from "primeng/table";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  numberOfRows: number = 15;

  totalRecords!: number;

  productDialog: boolean = false;

  loading: boolean = false;

  firstLoad: boolean = true;

  checked: boolean = false;


  emails!: History[];


  email!: History;


  selectedEmails: History[] = [];

  submitted: boolean = false;

  constructor(private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private historyService: HistoryService) {
  }

  unselect() {
    this.selectedEmails = [];
  }

  select() {
    if (this.checked) {
      this.selectedEmails = this.emails;
    } else {
      this.selectedEmails = [];
    }
  }

  ngOnInit() {
    setInterval(() => {
      console.log(this.selectedEmails)
    }, 10000)
    this.loading = true;
    this.historyService.getTotalNumberOfRows().subscribe(totalRecords => this.totalRecords = totalRecords);
    this.getCurrentHistoryPage(0, this.numberOfRows, 'id', -1);
  }

  lol() {
    this.selectedEmails = [];
  }

  private getCurrentHistoryPage(page: number, rows: number, sortFiled: string, sortOrder: number) {
    this.historyService.getPaginatedHistory(page, rows, sortFiled, sortOrder).subscribe({
      next: (emails: History[]) => {
        this.emails = emails;
        this.loading = false;
      },
      error: () => {
        setTimeout(() => {
          this.messageService.add({
            severity: 'error',
            summary: 'Failed',
            detail: "Couldn't load emails history!"
          });
          this.loading = false;
          this.getCurrentHistoryPage(0, this.numberOfRows, 'id', -1);
        }, 5000)
      }
    });
  }

  loadEmails(event: LazyLoadEvent) {

    console.log(event);
    this.loading = true;
    if (event.rows !== undefined) {

      let page = (event.first === undefined ? 0 : event.first) / event.rows;
      let sortField = (event.sortField === undefined) ? 'id' : event.sortField;
      let sortOrder = (event.sortOrder === undefined) ? -1 : event.sortOrder;
      if (this.firstLoad) {
        this.firstLoad = false;
        sortOrder = -1;
      }
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

        let ids = selected.map(x => x.id);
        this.historyService.deleteEmailsByIds(ids).subscribe({
          next: () => {
            this.emails = this.emails.filter(val => !selected.includes(val));
            this.getCurrentHistoryPage(0, this.numberOfRows, 'id', -1);
            this.checked = false;
            this.totalRecords = this.totalRecords - selected.length;
            this.selectedEmails = [];
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Products Deleted',
              life: 3000
            });
          },
          error: () => {
            this.selectedEmails = [];
            this.messageService.add({
              severity: 'error',
              summary: 'Failed',
              detail: "Couldn't delete selected emails!"
            });
          }
        })
      }
    });
  }

  deleteEmailById(id: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete selected email ?!',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.historyService.deleteEmailById(id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Email Deleted',
              life: 3000
            });
            this.emails = this.emails.filter(val => val.id !== id);
            this.totalRecords--;
          },
          error: () => this.messageService.add({
            severity: 'error',
            summary: 'Failed',
            detail: 'Email is not deleted',
            life: 3000
          })
        })
      }
    });
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

// findIndexById(id: string): number {
//   let index = -1;
//   for (let i = 0; i < this.products.length; i++) {
//     if (this.products[i].id === id) {
//       index = i;
//       break;
//     }
//   }
//
//   return index;
// }

}

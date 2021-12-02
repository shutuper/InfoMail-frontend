import {Component, OnInit} from '@angular/core';
import {PopupMessageService} from "../../../service/utils/popup-message.service";
import {ConfirmationService, LazyLoadEvent} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {ScheduledTaskService} from "../../../service/scheduled-task.service";
import {PaginatedScheduledTasks, ScheduledTask} from "../../../model/scheduled-tasks";

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  selectedTasks: ScheduledTask[] = [] as ScheduledTask[];   // tasks selected by checkboxes
  isChecked: boolean = false;      // is all emails selected
  numberOfRows: number = 15;      // default number of table rows
  totalNumberOfRows!: number;         // total number of tasks
  loading: boolean = false;     // icon of loading before actions completed
  firstLoad: boolean = true;   // marker for sorting by tasks' order ids (for first load)
  tasks!: ScheduledTask[];         // all tasks on current page (lazy loaded)
  maxSubjectLength = 40;     // max subject length in table that is not sliced

  constructor(private popupMessageService: PopupMessageService,
              private confirmationService: ConfirmationService,
              private scheduledTaskService: ScheduledTaskService,
              private router: Router,
              private route: ActivatedRoute) {
  }


  ngOnInit(): void {
    this.beginLoading();
    this.getCurrentTaskPage(0, this.numberOfRows, 'order_id', -1);
  }

  private beginLoading() {
    this.loading = true;
  }

  private finishLoading() {
    this.loading = false;
  }


  selectOrUnselectAllEmails() {
    this.selectedTasks = this.isChecked ? this.tasks : [];
  }

  sliceLongString(str: string, maxLength: number) {
    return (str.length >= maxLength) ? str.slice(0, maxLength - 1).concat('...') : str;
  }

  private getCurrentTaskPage(page: number, rows: number, sortFiled: string, sortOrder: number) {
    this.scheduledTaskService.getPaginatedTasks(page, rows, sortFiled, sortOrder).subscribe({
      next: (paginatedTasks: PaginatedScheduledTasks) => {
        console.log(paginatedTasks);
        this.tasks = paginatedTasks.tasks;
        this.totalNumberOfRows = paginatedTasks.totalNumberOfRows;
      },
      error: () => {
        setTimeout(() => {
          this.popupMessageService.showFailed("Couldn't load tasks!");
          this.getCurrentTaskPage(0, this.numberOfRows, 'order_id', -1);
        }, 5 * 1000)  // if failed to load data, recursively try to load emails after 5 seconds
      },
      complete: () => this.finishLoading()
    });
  }

  loadTasks(event: LazyLoadEvent) {  //loading emails after changing page/sorter
    console.log(event);
    if (event.rows) {
      this.beginLoading();

      let page = ((!event.first) ? 0 : event.first) / event.rows;
      let sortField = (!event.sortField) ? 'order_id' : event.sortField;
      let sortOrder = (!event.sortOrder) ? -1 : event.sortOrder;

      if (this.firstLoad || (sortField === 'order_id')) {  //default sorting by tasks orders' ids
        this.firstLoad = false;
        sortOrder = -1;
      }

      window.scrollTo(0, 0); // jump to top of the page before loading new content
      this.getCurrentTaskPage(page, event.rows, sortField, sortOrder);
    }
  }

}

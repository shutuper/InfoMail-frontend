import {Component, OnInit} from '@angular/core';
import {PopupMessageService} from "../../../service/utils/popup-message.service";
import {ConfirmationService, LazyLoadEvent} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {ScheduledTaskService} from "../../../service/scheduled-task.service";
import {PaginatedScheduledTasks, ScheduledTask} from "../../../model/scheduled-tasks";
import {TableCheckbox, TableHeaderCheckbox} from "primeng/table";

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  selectedTasks: ScheduledTask[] = [] as ScheduledTask[];   // tasks selected by checkboxes
  check = false;      // is all emails selected
  numberOfRows: number = 15;      // default number of table rows
  totalNumberOfRows!: number;         // total number of tasks
  loading: boolean = false;     // icon of loading before actions completed
  firstLoad: boolean = true;   // marker for sorting by tasks' order ids (for first load)
  tasks: ScheduledTask[] = [] as ScheduledTask[];        // all tasks on current page (lazy loaded)
  maxSubjectLength = 40;     // max subject length in table that is not sliced
  minNumberOfTasksOnPage = 10;

  confirmationHeader = 'Confirm';
  confirmationIcon = 'pi pi-exclamation-triangle';


  statusPaused = 'PAUSED';
  statusResumed = 'RESUMED';

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


  selectOrUnselectAllTasks() {
    return this.selectedTasks = this.check ? this.tasks : [] as ScheduledTask[];
  }

  sliceLongString(str: string, maxLength: number) {
    return (str.length >= maxLength) ? str.slice(0, maxLength - 1).concat('...') : str;
  }

  private getCurrentTaskPage(page: number, rows: number, sortFiled: string, sortOrder: number) {
    console.log('page: ' + page + ', rows:' + rows + ', sortFiled: ' + sortFiled + ', sortOrder: ' + sortOrder);
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


  deleteSelectedTasks() {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete selected tasks?`,
      header: this.confirmationHeader,
      icon: this.confirmationIcon,
      accept: () => this.deleteTasks()
    });
  }

  deleteTask(jobName: string) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete selected task?`,
      header: this.confirmationHeader,
      icon: this.confirmationIcon,
      accept: () => this.deleteTaskByName(jobName)
    })
  }

  pauseTask(jobName: string) {
    this.beginLoading();
    this.scheduledTaskService.pauseJobByName(jobName).subscribe({
      next: () => {
        this.popupMessageService.showSuccess('Task is paused now!');
        // @ts-ignore
        this.tasks.find(x => x.jobName === jobName).state = this.statusPaused;
      }, error: () => this.popupMessageService.showFailed('Task is not paused!'),
      complete: () => this.finishLoading()
    });
  }

  resumeTask(jobName: string) {
    this.beginLoading();
    this.scheduledTaskService.resumeJobByName(jobName).subscribe({
      next: () => {
        this.popupMessageService.showSuccess('Task is resumed now!');
        // @ts-ignore
        this.tasks.find(x => x.jobName === jobName).state = this.statusResumed;
      }, error: () => this.popupMessageService.showFailed('Task is not resumed!'),
      complete: () => this.finishLoading()
    });
  }

  deleteTaskByName(jobName: string) {
    this.beginLoading();
    this.scheduledTaskService.deleteJobByName(jobName).subscribe({
      next: () => {
        this.popupMessageService.showSuccess('Task is deleted!');
        this.tasks = this.tasks.filter(val => val.jobName !== jobName);
        this.totalNumberOfRows--;
        if (this.tasks.length <= this.minNumberOfTasksOnPage)
          this.ngOnInit();
      },
      error: () => {
        this.popupMessageService.showFailed('Task is not deleted!');
      },
      complete: () => this.finishLoading()
    });
  }

  deleteTasks() {
    {
      let selected = this.selectedTasks;
      console.log(selected);
      let jobNames = selected.map(x => x.jobName);  // get array of selected tasks' ids
      this.beginLoading();
      this.scheduledTaskService.deleteAllJobsByNamesIn(jobNames).subscribe({
          next: () => {
            this.tasks = this.tasks.filter(val => !selected.includes(val));
            this.check = false;
            this.totalNumberOfRows -= selected.length;
            this.selectedTasks = [];

            this.popupMessageService.showSuccess('Tasks are deleted!');

            if (this.tasks.length < this.minNumberOfTasksOnPage)
              this.ngOnInit();
          },
          error: () => {
            this.selectedTasks = [];
            this.popupMessageService.showFailed("Couldn't delete selected tasks!");
          },
          complete: () => this.finishLoading()
        }
      )
    }
  }

  openTaskView(jobName: string) {
    this.router.navigate([jobName], {relativeTo: this.route});
  }
}

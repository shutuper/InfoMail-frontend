import { Component, OnInit } from '@angular/core';
import {EmailWithTemplate, Recipient} from "../../../../model/email";
import {AngularEditorConfig} from "@kolkov/angular-editor";
import {PopupMessageService} from "../../../../service/utils/popup-message.service";
import {HistoryService} from "../../../../service/history.service";
import {ConfirmationService} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {ScheduledTaskFull} from "../../../../model/scheduled-tasks";
import {ScheduledTaskService} from "../../../../service/scheduled-task.service";

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.css']
})
export class TaskViewComponent implements OnInit {

  emailId!: number;
  jobName: string = '';
  task: ScheduledTaskFull = {} as ScheduledTaskFull;
  emailWithTemplate: EmailWithTemplate = {} as EmailWithTemplate;
  recipientsTO: string | undefined = undefined;
  recipientsCC: string | undefined = undefined;
  recipientsBCC: string | undefined = undefined;
  maxSubjectLength = 40;

  confirmationHeader = 'Confirm';
  confirmationIcon = 'pi pi-exclamation-triangle';

  statusPaused = 'PAUSED';
  statusResumed = 'RESUMED';

  editorConfig: AngularEditorConfig = {
    showToolbar: false,
    editable: false,
    minHeight: '200px'
  }

  showContent = false;

  constructor(private popupMessageService: PopupMessageService,
              private historyService: HistoryService,
              private taskService: ScheduledTaskService,
              private confirmationService: ConfirmationService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.jobName = this.route.snapshot.params['jobName'];

    this.taskService.getTaskByJobName(this.jobName).subscribe({
      next: (task: ScheduledTaskFull) => {
        this.task = task;
        console.log("Got: " + JSON.stringify(this.task));
        this.groupRecipients(this.task.recipients);
        this.showContent = true;
      },
      error: () => {
        this.popupMessageService.showFailed("Can't load task!");
      }
    })
  }

  private groupRecipients(recipients: Recipient[]) {
    this.recipientsTO = recipients.filter(rec => rec.recipientType.toString() === 'TO')
      .map(rec => rec.email).join(', ');

    this.recipientsCC = recipients.filter(rec => rec.recipientType.toString() === 'CC')
      .map(rec => rec.email).join(', ');

    this.recipientsBCC = recipients.filter(rec => rec.recipientType.toString() === 'BCC')
      .map(rec => rec.email).join(', ');
  }

  beginLoading() {
    this.showContent = false;
  }

  finishLoading() {
    this.showContent = true;
  }

  pauseTask() {
    this.beginLoading();
    this.taskService.pauseJobByName(this.jobName).subscribe({
      next: () => {
        this.popupMessageService.showSuccess('Task is paused now!');
        this.task.state = this.statusPaused;
      }, error: () => this.popupMessageService.showFailed('Task is not paused!'),
      complete: () => this.finishLoading()
    });
  }

  resumeTask() {
    this.beginLoading();
    this.taskService.resumeJobByName(this.jobName).subscribe({
      next: () => {
        this.popupMessageService.showSuccess('Task is resumed now!');
        this.task.state = this.statusResumed;
      }, error: () => this.popupMessageService.showFailed('Task is not resumed!'),
      complete: () => this.finishLoading()
    });
  }


  deleteTask() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this task?!',
      header: this.confirmationHeader,
      icon: this.confirmationIcon,
      accept: () => {
        this.deleteTaskByName(this.jobName);
      }
    });
  }

  deleteTaskByName(jobName: string) {
    this.beginLoading();
    this.taskService.deleteJobByName(jobName).subscribe({
      next: () => {
        this.popupMessageService.showSuccess('Task is deleted!');
        this.router.navigateByUrl('/tasks');
      },
      error: () => {
        this.popupMessageService.showFailed('Task is not deleted!');
      },
      complete: () => this.finishLoading()
    });
  }

  sliceLongString(str: string, maxLength: number) {
    return (str.length >= maxLength) ? str.slice(0, maxLength - 1).concat('...') : str;
  }

}

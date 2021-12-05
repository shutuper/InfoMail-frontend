import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {ExecutedEmail} from "../model/email";
import {PaginatedScheduledTasks, ScheduledTask} from "../model/scheduled-tasks";

@Injectable({
  providedIn: 'root'
})
export class ScheduledTaskService {

  resource = '/api/v1/tasks';
  jsonHeader = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private httpClient: HttpClient) {
  }

  getPaginatedTasks(page: number, rows: number, sortField: string, sortOrder: number) {

    if (sortField === 'state')
      sortField = 'trigger_state';
    else if (sortField === 'startAt')
      sortField = 'start_time';
    else if (sortField === 'endAt')
      sortField = 'end_time';
    else
      sortField = 'order_id';

    let emailsPagination = new HttpParams()
      .set('page', page).set('rows', rows)
      .set('sortField', sortField).set('sortOrder', sortOrder);

    return this.httpClient.get<PaginatedScheduledTasks>(this.resource, {params: emailsPagination});
  }


  pauseJobByName(jobName: string) {
    return this.httpClient.patch(`${this.resource}/pause/${jobName}`, null);
  }

  pauseAllUserJobs() {
    return this.httpClient.patch(`${this.resource}/pauseAll`, null);
  }

  resumeJobByName(jobName: string) {
    return this.httpClient.patch(`${this.resource}/resume/${jobName}`, null);
  }

  resumeAllUserJobs() {
    return this.httpClient.patch(`${this.resource}/resumeAll`, null);
  }

  deleteJobByName(jobName: string) {
    return this.httpClient.delete(`${this.resource}/${jobName}`);
  }

  deleteAllJobsByNamesIn(jobNames: string[]) {
    return this.httpClient.delete(this.resource, this.generateHttpOptions(jobNames));
  }


  generateHttpOptions(body: any) {
    return {
      headers: this.jsonHeader,
      body: {
        jobNames: body
      }
    };
  }

}

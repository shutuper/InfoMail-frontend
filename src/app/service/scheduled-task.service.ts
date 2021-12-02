import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {ExecutedEmail} from "../model/email";
import {PaginatedScheduledTasks, ScheduledTask} from "../model/scheduled-tasks";

@Injectable({
  providedIn: 'root'
})
export class ScheduledTaskService {

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

    return this.httpClient.get<PaginatedScheduledTasks>("/api/v1/tasks", {params: emailsPagination});
  }


}

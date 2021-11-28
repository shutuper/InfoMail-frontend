import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {EmailWithTemplate, ExecutedEmail} from "../model/email";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor(private httpClient: HttpClient) {
  }

  getPaginatedHistory(page: number, rows: number, sortField: string, sortOrder: number) {
    if (sortField === 'status') sortField = 'emailStatus';
    if (sortField === 'dateTime') sortField = 'logDateTime';
    let emailsPagination = new HttpParams()
      .set('page', page).set('rows', rows)
      .set('sortField', sortField).set('sortOrder', sortOrder)
    return this.httpClient.get<ExecutedEmail[]>("/api/v1/history", {params: emailsPagination});
  }

  getEmailById(emailId: number): Observable<EmailWithTemplate> {
    return this.httpClient.get<EmailWithTemplate>(`/api/v1/history/${emailId}`);
  }

  deleteEmailById(emailId: number) {
    return this.httpClient.delete(`/api/v1/history/${emailId}`);
  }

  getTotalNumberOfRows() {
    return this.httpClient.get<number>('/api/v1/history/total');
  }

  deleteEmailsByIds(ids: number[]) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        ids
      }
    };
    return this.httpClient.delete('/api/v1/history', options);
  }

  retryFailed(emailId: number) {
    return this.httpClient.put<ExecutedEmail>(`/api/v1/history/${emailId}`, null);
  }
}

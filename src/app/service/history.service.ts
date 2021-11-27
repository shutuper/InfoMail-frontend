import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {History} from "../model/email";

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
      .set('sortField', sortField).set('sortOrder',sortOrder)
    return this.httpClient.get<History[]>("/api/v1/history", {params: emailsPagination});
  }

  deleteEmailById(id: number) {
    return this.httpClient.delete(`/api/v1/history/${id}`);
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
    return this.httpClient.put<History>(`/api/v1/history/${emailId}`,null);
  }
}

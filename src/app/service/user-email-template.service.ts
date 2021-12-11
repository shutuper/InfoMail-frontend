import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {EmailTemplate, TemplateAsOption} from "../model/email";
import {Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class UserEmailTemplateService {

  constructor(private http: HttpClient) {
  }

  saveTemplate(template: EmailTemplate): Observable<EmailTemplate> {
    return this.http.post<EmailTemplate>(`/api/v1/usertemplates`, template);
  }

  getAllAsOptions() {
    return this.http.get<TemplateAsOption[]>('/api/v1/usertemplates/options');
  }

  getTemplateById(id: number): Observable<EmailTemplate> {
    return this.http.get<EmailTemplate>(`/api/v1/usertemplates/${id}`);
  }

  deleteEmailTemplateById(id: number) {
    return this.http.delete(`/api/v1/usertemplates/${id}`);
  }

  deleteEmailTemplatesByIds(ids: number[]) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        ids
      }
    };
    return this.http.delete('/api/v1/usertemplates', options);
  }

  getTotalNumberOfRows(): Observable<number> {
    return this.http.get<number>('/api/v1/usertemplates/total');
  }

  getPaginatedTemplates(page: number, rows: number, sortField: string, sortOrder: number) {
    const templatesPagination = new HttpParams()
      .set('page', page).set('rows', rows)
      .set('sortField', sortField).set('sortOrder', sortOrder)
    return this.http.get<EmailTemplate[]>("/api/v1/usertemplates", {params: templatesPagination});
  }
}

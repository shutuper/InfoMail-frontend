import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {EmailTemplate} from "../model/email";
import {Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class UserEmailTemplateService {

  constructor(private http: HttpClient){}

  addTemplateLol(): void {

    const time: Date = new Date()

    const template: EmailTemplate = {
      name: "Name_" + time.getHours() + + time.getMinutes(),
      subject: "Subject_" + time.getHours() + + time.getMinutes(),
      body: "Body_" + time.getHours() + + time.getMinutes()
    } as EmailTemplate
    this.http
      .post<HttpResponse<any>>(`/api/v1/usertemplates`, template).subscribe();
  }

  saveTemplate(template: EmailTemplate): Observable<EmailTemplate> {
    return this.http.post<EmailTemplate>(`/api/v1/usertemplates`, template);
  }

  getTemplatesLol(): void {
    this.http
      .get<EmailTemplate[]>(`/api/v1/usertemplates`).subscribe({
      next:(res) => res.forEach((e) => console.log(e))});
  }

  getTemplates(): Observable<EmailTemplate[]> {
    return this.http.get<EmailTemplate[]>(`/api/v1/usertemplates`);
  }

  getTemplateBySharingId(sharingId: string): Observable<EmailTemplate> {
    return this.http.get<EmailTemplate>(`/api/v1/usertemplates/shared/${sharingId}`);
  }

  saveSharedTemplate(template: EmailTemplate): Observable<any> {
    return this.http.post(`/api/v1/usertemplates/shared/`, template);
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
}

import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {EmailTemplate} from "../model/email";
import {Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class TemplateService {

  constructor(private http: HttpClient){}

  addTemplateLol(): void {

    const time: Date = new Date()

    const template: EmailTemplate = {
      name: "Name_" + time.getHours() + + time.getMinutes(),
      subject: "Subject_" + time.getHours() + + time.getMinutes(),
      body: "Body_" + time.getHours() + + time.getMinutes()
    } as EmailTemplate
    this.http
      .post<HttpResponse<any>>(`/api/v1/templates`, template).subscribe();
  }

  saveTemplate(template: EmailTemplate): Observable<EmailTemplate> {
    return this.http.post<EmailTemplate>(`/api/v1/templates`, template);
  }

  getTemplatesLol(): void {
    this.http
      .get<EmailTemplate[]>(`/api/v1/templates`).subscribe({
      next:(res) => res.forEach((e) => console.log(e))});
  }

  getTemplates(): Observable<EmailTemplate[]> {
    return this.http.get<EmailTemplate[]>(`/api/v1/templates`);
  }

  getTemplateById(id: number): Observable<EmailTemplate> {
    return this.http.get<EmailTemplate>(`/api/v1/templates/${id}`);
  }

  deleteEmailTemplateById(id: number) {
    return this.http.delete(`/api/v1/templates/${id}`);
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
    return this.http.delete('/api/v1/templates', options);
  }
}

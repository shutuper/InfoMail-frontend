import {Injectable} from "@angular/core";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {EmailTemplate} from "../model/email";
import {Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class TemplateService {

  constructor(private http: HttpClient){}

  addTemplateLol(): void {

    const time: Date = new Date()

    const template: EmailTemplate = {
      id: 0,
      name: "Name_" + time.getHours() + + time.getMinutes(),
      subject: "Subject_" + time.getHours() + + time.getMinutes(),
      body: "Body_" + time.getHours() + + time.getMinutes()
    }
    this.http
      .post<HttpResponse<any>>(`/api/v1/templates`, template).subscribe();
  }

  getTemplatesLol(): void {
    this.http
      .get<EmailTemplate[]>(`/api/v1/templates`).subscribe({
      next:(res) => res.forEach((e) => console.log(e))});
  }

  getTemplates(): Observable<EmailTemplate[]> {
    return this.http.get<EmailTemplate[]>(`/api/v1/templates`);
  }

  deleteEmailById(id: number) {
    return this.http.delete(`/api/v1/history/${id}`);
  }
}

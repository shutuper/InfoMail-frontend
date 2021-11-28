import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {EmailTemplate, EmailWithTemplate} from "../model/email";
import {Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class EmailTemplateService {

  constructor(private http: HttpClient){}

  getTemplateById(id: number): Observable<EmailWithTemplate> {
    return this.http.get<EmailWithTemplate>(`/api/v1/templates/${id}`);
  }
}

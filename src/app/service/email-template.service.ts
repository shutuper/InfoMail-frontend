import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {EmailTemplate} from "../model/email";
import {Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class EmailTemplateService {

  constructor(private http: HttpClient){}

  getTemplateById(id: number): Observable<EmailTemplate> {
    return this.http.get<EmailTemplate>(`/api/v1/templates/${id}`);
  }
}

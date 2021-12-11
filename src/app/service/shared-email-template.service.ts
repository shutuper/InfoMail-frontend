import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {EmailTemplate} from "../model/email";
import {Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class SharedEmailTemplateService {

  constructor(private http: HttpClient) {
  }

  getTemplateBySharingId(sharingId: string): Observable<EmailTemplate> {
    return this.http.get<EmailTemplate>(`/api/v1/sharedtemplates/${sharingId}`);
  }

  saveTemplateBySharingId(sharingId: string): Observable<any> {
    return this.http.post<any>(`/api/v1/sharedtemplates/${sharingId}`, null);
  }

}

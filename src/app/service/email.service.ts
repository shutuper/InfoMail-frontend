import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Email} from "../model/email";
import {Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class EmailService {

  constructor(private http: HttpClient) {
  }

  public sendEmail(email: Email): Observable<Email> {
    return this.http
      .post<Email>(`/api/v1/emails/`, email);
  }
}

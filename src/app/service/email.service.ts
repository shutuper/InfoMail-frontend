import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Email} from "../model/email";

@Injectable({providedIn: 'root'})
export class EmailService {

  constructor(private http: HttpClient){}

  public sendEmail(email: Email): void {
    this.http
      .post<Email>(`/api/v1/emails/`, email)
      .subscribe((response: Email) => console.log(response));
  }
}

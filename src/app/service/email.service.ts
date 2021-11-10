import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Email} from "../model/email";

@Injectable({providedIn: 'root'})
export class EmailService {
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient){}

  public sendEmail(email: Email): void {
    this.http
      .post<Email>(`${this.apiServerUrl}/api/v1/emails/`, email)
      .subscribe((response: Email) => console.log(response));
  }
}

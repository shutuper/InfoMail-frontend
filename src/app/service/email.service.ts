import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Email} from "../model/email";

@Injectable({providedIn: 'root'})
export class EmailService {
  private apiServerUrl = environment.apiBaseUrl;
  public authorizationToken = environment.authorizationToken;

  constructor(
    private http: HttpClient,
  ){}

  public sendEmail(email: Email): void {
    const headers = new HttpHeaders().append('Authorization', this.authorizationToken);

    this.http
      .post<Email>(
        `${this.apiServerUrl}/api/v1/emails/`,
        email,
        {headers: headers}
      )
      .subscribe((response: Email) => console.log(response));
  }
}

import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Email} from "../model/email";
import {AuthenticationService} from "./authentication.service";

@Injectable({providedIn: 'root'})
export class EmailService {
  private apiServerUrl = environment.apiBaseUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ){}

  public sendEmail(email: Email): void {
    const headers = new HttpHeaders().append('Authorization', this.authService.getAuthToken());

    this.http
      .post<Email>(
        `${this.apiServerUrl}/api/v1/emails/`,
        email,
        {headers: headers}
      )
      .subscribe((response: Email) => console.log(response));
  }
}

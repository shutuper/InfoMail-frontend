import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Email} from "../model/email";
import {AuthenticationService} from "./authentication.service";

@Injectable({providedIn: 'root'})
export class EmailService {

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ){}

  public sendEmail(email: Email): void {
    const headers = new HttpHeaders().append('Authorization', this.authService.getAuthToken());

    this.http
      .post<Email>(
        `/api/v1/emails/`,
        email,
        {headers: headers}
      )
      .subscribe((response: Email) => console.log(response));
  }
}

import {Injectable} from "@angular/core";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {User} from "../models/user";
import {Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class RegistrationService {

  constructor(private http: HttpClient) {
  }

  public toRegister(userCredentials: User): Observable<HttpResponse<any>> {
    return this.http.post<HttpResponse<any>>(`/api/v1/registration`, userCredentials);
  }

  public confirmToken(token: string): Observable<HttpResponse<any>> {
    return this.http.get<HttpResponse<any>>(`/api/v1/registration/confirm?token=${token}`);
  }

  public rejectToken(token: string): Observable<HttpResponse<string>> {
    return this.http.get<HttpResponse<string>>(`/api/v1/registration/reject?token=${token}`);
  }
}

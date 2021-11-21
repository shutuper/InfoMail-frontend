import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {User} from "../model/user";
import {Observable} from "rxjs";
import {RegistrationResponse} from "../model/registration-response";

@Injectable({providedIn: 'root'})
export class RegistrationService {

  constructor(private http: HttpClient) {
  }

  public toRegister(userCredentials: User): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(`/api/v1/registration`, userCredentials);
  }
}

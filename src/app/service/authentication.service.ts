import {Injectable} from "@angular/core";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {User} from "../model/user";
import {Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class AuthenticationService {

  constructor(private http: HttpClient){}

  public hasAuthToken(): boolean {
    const tokenAtStorage = localStorage.getItem("token");
    return tokenAtStorage !== null && tokenAtStorage !== '';
  }

  public setAuthToken(token: string): void {
    localStorage.setItem("token", token);
  }

  public getAuthToken(): string {
    const tokenAtStorage = localStorage.getItem("token");
    return tokenAtStorage !== null ? tokenAtStorage : '';
  }

  public tryToAuthenticate(userCredentials: User): Observable<HttpResponse<any>> {
    return this.http.post(`/api/v1/authenticate`, userCredentials, {observe: 'response'});
  }

  public logout(): void {
    console.log("Remove token from localStorage");
    localStorage.removeItem("token");
  }
}

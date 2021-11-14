import {Injectable} from "@angular/core";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {User} from "../model/user";
import {environment} from "../../environments/environment";

@Injectable({providedIn: 'root'})
export class AuthenticationService {
  private apiServerUrl = environment.apiBaseUrl

  constructor(
    private http: HttpClient,
  ){}

  public hasAuthToken(): boolean {
    return localStorage.getItem("token") !== null;
  }

  private setAuthToken(token: string): void {
    localStorage.setItem("token", token);
  }

  getAuthToken(): string | null{
    if(localStorage.getItem("token") !== null) {
      throw "Token not found";
    }
    return localStorage.getItem("token");
  }

  tryToAuthenticate(userCredentials: User) {
    console.log("Trying to Authenticate")
    this.http
      .post(`${this.apiServerUrl}/api/v1/authenticate`, userCredentials, {observe: 'response'})
      .subscribe({
        next: (response: HttpResponse<any>) => {
          const token: string | null = response.headers.get('Authorization');
          if (token === null) {console.error("Token not exists");}
          else {this.setAuthToken(token);}
        },
        error: (e) => console.error("Credentials Bad"),
        complete: () => {
          console.log("Auth success, token added to localStorage")
        }
      });
  }

  logout(): void {
    localStorage.removeItem("token");
    console.log("Token removed from localStorage")
  }
}

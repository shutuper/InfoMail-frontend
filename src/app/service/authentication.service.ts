import {Injectable} from "@angular/core";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {User} from "../model/user";
import {UserService} from "./user.service";

@Injectable({providedIn: 'root'})
export class AuthenticationService {

  constructor(
    private http: HttpClient, private userService: UserService
  ){}

  public hasAuthToken(): boolean {
    return localStorage.getItem("token") !== null;
  }

  private setAuthToken(token: string): void {
    localStorage.setItem("token", token);
  }

  getAuthToken(): string{
    const tokenAtStorage = localStorage.getItem("token");
    return tokenAtStorage !== null ? tokenAtStorage : '';
  }

  tryToAuthenticate(userCredentials: User) {
    console.log("Trying to Authenticate")
    this.http
      .post(`/api/v1/authenticate`, userCredentials, {observe: 'response'})
      .subscribe({
        next: (response: HttpResponse<any>) => {
          const token: string | null = response.headers.get('Authorization');
          if (token === null) {console.error("Token not exists");}
          else {this.setAuthToken(token);}
        },
        error: (e) => console.error("Credentials Bad"),
        complete: () => {
          console.log("Auth success, token added to localStorage")
          console.log("Setup user email in userService")
          this.userService.userEmail = userCredentials.email
        }
      });
  }

  logout(): void {
    localStorage.removeItem("token");
    console.log("Token removed from localStorage")
    console.log("Clean user email in userService")
    this.userService.userEmail = '';
  }
}

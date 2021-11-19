import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {User} from "../model/user";
import {Observable} from "rxjs";
import {Router} from "@angular/router";

@Injectable({providedIn: 'root'})
export class AuthenticationService {

  constructor(
    private http: HttpClient, private router: Router
  ){}

  public hasAuthToken(): boolean {
    const tokenAtStorage = localStorage.getItem("token");
    return tokenAtStorage !== null && tokenAtStorage !== '';
  }

  public checkIsAuthTokenActual(): void {
    if(! this.hasAuthToken()) {
      console.log("Navigate to welcome page");
      this.router.navigate(['welcome']);
      return;
    }

    this.sendTestRequest().subscribe({
      error: (err: HttpErrorResponse) => {
        if(err.status == 504) console.log("Can't connect to server", err);
        if(err.status == 403) {
          console.log("Can't authenticate", err);
          this.logout();
        }
      }
    });
  }

  private setAuthToken(token: string): void {
    localStorage.setItem("token", token);
  }

  public getAuthToken(): string {
    const tokenAtStorage = localStorage.getItem("token");
    return tokenAtStorage !== null ? tokenAtStorage : '';
  }

  public tryToAuthenticate(userCredentials: User) {
    console.log("Trying to Authenticate")
    this.sendUserCredentials(userCredentials).subscribe({
        next: (res) => {
          const token: string | null = res.headers.get('Authorization');

          if (token === null) {
            console.error("Token not exits in response");}
          else {
            this.setAuthToken(token);

            this.router.navigate(['home']);
            console.log("Navigate to home page")
          }
        },
        error: (err: HttpErrorResponse) => {
          console.error("error when try to authenticate", err)
        }
      });
  }

  private sendUserCredentials(userCredentials: User): Observable<HttpResponse<any>> {
    return this.http.post(`/api/v1/authenticate`, userCredentials, {observe: 'response'});
  }

  public sendTestRequest(): Observable<any> {
    return this.http.get('api/v1/registration/sayHi', {observe: 'response'});
  }

  public logout(): void {
    console.log("Remove token from localStorage");
    localStorage.removeItem("token");

    console.log("Navigate to welcome page");
    this.router.navigate(['welcome']);
  }
}

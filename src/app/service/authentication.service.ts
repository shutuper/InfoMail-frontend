import {Injectable} from "@angular/core";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {User} from "../model/user";
import {catchError, map, Observable} from "rxjs";
import {Router} from "@angular/router";

@Injectable({providedIn: 'root'})
export class AuthenticationService {

  constructor(private http: HttpClient, private router: Router) {
  }

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

  public isAuthenticated(): Observable<boolean> {
    return this.http.get('api/v1/users').pipe(
      map(() => true),
      catchError(map(() => {
        // this.router.navigateByUrl('/welcome');
        return false;
      }))
    );
  }

  public logout(): void {
    console.log("Remove token from localStorage");
    localStorage.removeItem("token");
  }
}

import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class AuthService {

  constructor(
    private http: HttpClient,
  ){}

  public hasAuthToken(): boolean {
    return localStorage.getItem("token") !== null;
  }

}

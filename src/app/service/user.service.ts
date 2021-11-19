import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {User} from "../model/user";
import {Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class UserService {

  constructor(private http: HttpClient){}

  getUsersEmail(): Observable<User>{
    return this.http.get<User>(`/api/v1/users/email`);
  }

}

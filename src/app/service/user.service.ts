import {Injectable} from "@angular/core";

@Injectable({providedIn: 'root'})
export class UserService {
  private _userEmail: string = '';


  get userEmail(): string {
    return this._userEmail;
  }

  set userEmail(value: string) {
    this._userEmail = value;
  }
}

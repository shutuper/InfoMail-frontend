import {Injectable} from "@angular/core";

@Injectable({providedIn: 'root'})
export class UserService {
  private _userEmail: string | null = null;

  get userEmail(): string | null {
    return this._userEmail;
  }

  set userEmail(value: string | null) {
    this._userEmail = value;
  }

}

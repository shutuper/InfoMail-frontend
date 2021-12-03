import {Injectable} from "@angular/core";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {AuthenticationService} from "./authentication.service";
import {Router} from "@angular/router";
import {PopupMessageService} from "./utils/popup-message.service";

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthenticationService,
    private popupMessageService: PopupMessageService,
    private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //put Authorization Token
    const authReq = req.clone({
      headers: req.headers.set('Authorization', this.authService.getAuthToken()),
    });
    return next.handle(authReq).pipe(
      tap({
        error: (err: HttpErrorResponse) => {
          console.log("intercept errr", err)
          if (err.status > 500 && err.status != 504) this.openErrorPage("Can't connect to server");
          if (err.status === 504) this.popupMessageService.showWarning('Server is temporarily unavailable, please try again later');
          if (err.status === 404) this.openErrorPage("Can't find page");
          if (err.status === 401 || err.status === 403) this.logout();
        }
      })
    );
  }

  private logout(): void {
    this.authService.logout();
    this.openLoginPage();
  }

  private openWelcomePage() {
    console.log("Navigate to welcome page");
    this.router.navigate(['welcome']);
  }

  private openLoginPage() {
    console.log("Navigate to login page");
    this.router.navigate(['auth/login']);
  }

  private openErrorPage(message: string) {
    console.log(message);

    console.log("Navigate to Error page");
    this.router.navigate(['error']);
  }
}

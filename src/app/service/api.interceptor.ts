import {Injectable} from "@angular/core";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {AuthenticationService} from "./authentication.service";
import {Router} from "@angular/router";
import {PopupMessageService} from "./utils/popup-message.service";
import {environment} from "../../environments/environment";

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
      url: environment.API_URL + this.getValidUrl(req.url),
      headers: req.headers.set('Authorization', this.authService.getAuthToken())
    });
    return next.handle(authReq).pipe(
      tap({
        error: (err: HttpErrorResponse) => {
          console.log("intercept error", err)
          if (!err.status)
            this.openErrorPage("Can't connect to server");
          const statusCode: number = err.status;

          switch (statusCode) {
            case 401 | 403: {
              this.logout();
              break;
            }
            case 404: {
              this.openErrorPage("Can't find page");
              break;
            }
            case 500 | 501 | 502: {
              this.openErrorPage("Internal Server Error");
              break;
            }
            case 503: {
              this.openErrorPage("Can't connect to server");
              break;
            }
            case 504: {
              this.popupMessageService.showWarning('Server is temporarily unavailable, please try again later');
              break;
            }
          }

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

  getValidUrl(url: string) {
    return url.startsWith("/") ? url : "/".concat(url);
  }

}

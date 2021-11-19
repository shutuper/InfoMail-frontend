import {Injectable} from "@angular/core";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {AuthenticationService} from "./authentication.service";
import {Router} from "@angular/router";

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticationService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //put Authorization Token
    const authReq = req.clone({
      headers: req.headers.set('Authorization', this.authService.getAuthToken()),
    });
    return next.handle(authReq).pipe(
      tap({
        error: (err: HttpErrorResponse) => {
          if(err.status === 403) this.logout();
          if(err.status === 503) this.openErrorPage("Can't connect to server");
        }
      })
    );
  }

  private logout(): void {
    this.authService.logout();
    this.openWelcomePage();
  }

  private openWelcomePage() {
    console.log("Navigate to welcome page");
    this.router.navigate(['welcome']);
  }

  private openErrorPage(message: string) {
    console.error(message)

    console.log("Navigate to Error page");
    this.router.navigate(['error']);
  }
}

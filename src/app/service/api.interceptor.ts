import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {AuthenticationService} from "./authentication.service";

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(this.authService.hasAuthToken()) {
      //put Authorization Token
      const authReq = req.clone({
        headers: req.headers.set('Authorization', this.authService.getAuthToken()),
      });
      return next.handle(authReq).pipe(
        tap({
          error: (e) => console.log("error when intercept", e)
        })
      );
    }

    return next.handle(req);
  }
}

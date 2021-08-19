import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, ofType, Effect } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, switchMap, map, tap } from "rxjs/operators";

import { environment } from "src/environments/environment";
import { AuthResponseData, AuthService } from "../auth.service";
import { User } from "../user.model";
import * as fromAuthActions from './auth.actions'


const HandleAuthentication = (email: string, userId: string, token: string, expiresIn: number) => {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));
    return new fromAuthActions.Authenticate({ email: email, userId: userId, token: token, expirationDate: expirationDate })
}
const handleError = (errorRes) => {
    let error = 'An error occurred!';
    console.log(errorRes);
    if (!errorRes.error || !errorRes.error.error) {
        return of(new fromAuthActions.AuthenticateFailed(error));
    }
    switch (errorRes.error.error.message) {
        case 'EMAIL_EXISTS': error = 'The email address is already in use by another account!'; break;
        case 'OPERATION_NOT_ALLOWED': error = 'Password sign-in is disabled for this project.'; break;
        case 'TOO_MANY_ATTEMPTS_TRY_LATER': error = 'Try again later.'; break;
        case 'EMAIL_NOT_FOUND': error = 'There is no user record corresponding to this identifier. The user may have been deleted.'; break;
        case 'INVALID_PASSWORD': error = 'The password is invalid or the user does not have a password.'; break;
        case 'USER_DISABLED': error = 'he user account has been disabled.'; break;
    }
    return of(new fromAuthActions.AuthenticateFailed(error));
}

@Injectable()
export class AuthEffects {

    @Effect()
    authSignup = this.actions$.pipe(
        ofType(fromAuthActions.SIGNUP_START),
        switchMap((authData: fromAuthActions.SignupStart) => {
            return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
                {
                    email: authData.payload.email,
                    password: authData.payload.password,
                    returnSecureToken: true
                }).pipe(
                    tap((resData) => {
                        this.authService.setLogoutTimer(+resData.expiresIn * 1000);
                    }),
                    map(resData => {
                        return HandleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
                    }),
                    catchError(errorRes => {
                        return handleError(errorRes);
                    })
                );
        })
    );


    @Effect()
    authLogin = this.actions$.pipe(
        ofType(fromAuthActions.LOGIN_START),
        switchMap((authData: fromAuthActions.LoginStart) => {
            return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
                {
                    email: authData.payload.email,
                    password: authData.payload.password,
                    returnSecureToken: true,
                }).pipe(
                    tap((resData) => {
                        this.authService.setLogoutTimer(+resData.expiresIn * 1000);
                    }),
                    map(resData => {
                        return HandleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
                    }),
                    catchError(errorRes => {
                        return handleError(errorRes);
                    }));
        }),
    );


    @Effect()
    AutoLogin = this.actions$.pipe(
        ofType(fromAuthActions.AUTO_LOGIN),
        map(() => {
            const userData: { email: string; id: string; _token: string; _tokenExpirationDate: string; } = JSON.parse(localStorage.getItem('userData'));

            if (!userData) {
                return { type: 'ZERO' };
            }
            const loggedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
            if (loggedUser.token) {     //if valid token
                const expiresIn: number = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
                this.authService.setLogoutTimer(expiresIn);
                return new fromAuthActions.Authenticate({ email: userData.email, userId: userData.id, token: userData._token, expirationDate: new Date(userData._tokenExpirationDate) });
            }
            return { type: 'ZERO' };
        })
    );


    @Effect({ dispatch: false })
    authRedirect = this.actions$.pipe(
        ofType(fromAuthActions.AUTHENTICATE),
        tap(() => {
            this.router.navigate(['/']);
        })
    )

    @Effect({ dispatch: false })
    authLogout = this.actions$.pipe(
        ofType(fromAuthActions.LOGOUT),
        tap(() => {
            this.authService.clearLogoutTimer();
            localStorage.removeItem('userData');
            this.router.navigate(['/auth']);
        })
    )

    constructor(private actions$: Actions, private http: HttpClient, private router: Router, private authService: AuthService) { }
}
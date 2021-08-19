import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, ofType, Effect, createEffect } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, switchMap, map, tap } from "rxjs/operators";

import { environment } from "src/environments/environment";
import { AuthResponseData } from "../auth.service";
import * as fromAuthActions from './auth.actions'


const HandleAuthentication = (email: string, userId: string, token: string, expiresIn: number) => {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
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
                    map(resData => {
                        return HandleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
                    }),
                    catchError(errorRes => {
                        return handleError(errorRes);
                    }));
        }),
    );


    @Effect({ dispatch: false })
    authRedirect = this.actions$.pipe(
        ofType(fromAuthActions.AUTHENTICATE, fromAuthActions.LOGOUT),
        tap(() => {
            this.router.navigate(['/']);
        })
    )
    constructor(private actions$: Actions, private http: HttpClient, private router: Router) { }

}
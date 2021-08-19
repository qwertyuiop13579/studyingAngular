import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, tap } from "rxjs/operators";
import { throwError } from "rxjs";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";

import { User } from "./user.model"
import { environment } from "src/environments/environment";
import * as fromApp from "../store/app.reduser";
import * as fromAuthActions from "./store/auth.actions";

export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private expirationTimer: any;

    constructor(private http: HttpClient, private router: Router, private store: Store<fromApp.AppState>) { }


    autoLogin() {
        console.log('autologin.');
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));

        if (!userData) {
            return;
        }
        const loggedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
        if (loggedUser.token) {     //if valid token
            this.store.dispatch(new fromAuthActions.Authenticate({ email: userData.email, userId: userData.id, token: userData._token, expirationDate: new Date(userData._tokenExpirationDate) }));
            const expiresIn: number = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expiresIn);
        }
    }

    logout() {
        this.store.dispatch(new fromAuthActions.Logout());
        localStorage.removeItem('userData');
        if (this, this.expirationTimer) {
            clearTimeout(this.expirationTimer);
        }
        this.expirationTimer = null;
        console.log('Logout success.')
    }

    autoLogout(expirationDuration: number) {
        this.expirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration)
    }

    private handleError(errorRes: HttpErrorResponse) {
        let error = 'An error occurred!';
        console.log(errorRes);
        if (!errorRes.error || !errorRes.error.error) {
            return throwError(error);
        }
        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS': error = 'The email address is already in use by another account!'; break;
            case 'OPERATION_NOT_ALLOWED': error = 'Password sign-in is disabled for this project.'; break;
            case 'TOO_MANY_ATTEMPTS_TRY_LATER': error = 'Try again later.'; break;
            case 'EMAIL_NOT_FOUND': error = 'There is no user record corresponding to this identifier. The user may have been deleted.'; break;
            case 'INVALID_PASSWORD': error = 'The password is invalid or the user does not have a password.'; break;
            case 'USER_DISABLED': error = 'he user account has been disabled.'; break;
        }
        return throwError(error);
    }

    private HandleAuthentication(email: string, localId: string, idToken: string, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(email, localId, idToken, expirationDate);
        this.store.dispatch(new fromAuthActions.Authenticate({ email: email, userId: localId, token: idToken, expirationDate: expirationDate }));
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }
}
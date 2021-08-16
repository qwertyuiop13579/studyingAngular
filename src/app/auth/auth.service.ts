import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";

interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private http: HttpClient) { }
    signUp(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA6guo2h-6ZsBMZbbBHPHwiFyd4mYjyQmo',
            {
                email: email,
                password: password,
                returnSecureToken: true
            }).pipe(catchError(errorRes => {
                let error = 'An error occurred!';
                if (!errorRes.error || !errorRes.error.error) {
                    return throwError(error);
                }
                switch (errorRes.error.error.message) {
                    case 'EMAIL_EXISTS': error = 'The email address is already in use by another account!'; break;
                    case 'OPERATION_NOT_ALLOWED': error = 'Password sign-in is disabled for this project.'; break;
                    case 'TOO_MANY_ATTEMPTS_TRY_LATER': error = ' Try again later.'; break;
                }
                return throwError(error);
            }));

    }
}
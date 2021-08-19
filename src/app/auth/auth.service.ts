import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";

import * as fromApp from "../store/app.reduser";
import * as fromAuthActions from "./store/auth.actions";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private expirationTimer: any;

    constructor(private store: Store<fromApp.AppState>) { }

    setLogoutTimer(expirationDuration: number) {
        this.expirationTimer = setTimeout(() => {
            this.store.dispatch(new fromAuthActions.Logout());
        }, expirationDuration)
    }

    clearLogoutTimer() {
        if (this.expirationTimer) {
            clearTimeout(this.expirationTimer);
        }
        this.expirationTimer = null;
    }
}
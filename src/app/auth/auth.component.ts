import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import * as fromApp from '../store/app.reduser';
import { AuthResponseData, AuthService } from './auth.service';
import * as AuthActions from './store/auth.actions';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnDestroy, OnInit {
    isLoginMode = true;
    isLoading = false;
    error: string = '';
    @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;
    private closeAlertSub: Subscription;

    constructor(private authService: AuthService, private router: Router, private componentFactoryResolver: ComponentFactoryResolver,
        private store: Store<fromApp.AppState>) { }


    ngOnInit() {
        this.store.select('auth').subscribe(authState => {
            this.isLoading = authState.isLoading;
            this.error = authState.authError;
            if (this.error) {
                this.showErrorAlert(this.error);
            }
        });
    }
    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(authForm: NgForm) {
        if (!authForm.valid) return;
        const email = authForm.value.email;
        const password = authForm.value.password;
        let authObservable: Observable<AuthResponseData>;
        this.isLoading = true;

        if (this.isLoginMode) {
            //authObservable = this.authService.login(email, password);
            this.store.dispatch(new AuthActions.LoginStart({ email: email, password: password }));
        }
        else {
            authObservable = this.authService.signUp(email, password);
        }


        // authObservable.subscribe(resData => {
        //     //console.log(resData);
        //     this.isLoading = false;
        //     this.router.navigate(['/recipes']);
        // }, errorMessage => {
        //     console.log(errorMessage);
        //     this.error = errorMessage;
        //     this.showErrorAlert(errorMessage);
        //     this.isLoading = false;
        // })

        authForm.reset();
    }

    onCloseAlert() {
        this.error = null;
    }

    private showErrorAlert(mess: string) {
        const alertCompFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
        const hostViewContatinerRef = this.alertHost.viewContainerRef;
        hostViewContatinerRef.clear();
        const alertCompRef = hostViewContatinerRef.createComponent(alertCompFactory);
        alertCompRef.instance.message = mess;
        this.closeAlertSub = alertCompRef.instance.closeEvent.subscribe(() => {
            this.closeAlertSub.unsubscribe();
            hostViewContatinerRef.clear();
        });
    }

    ngOnDestroy() {
        if (this.closeAlertSub) this.closeAlertSub.unsubscribe();
    }
}

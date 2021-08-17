import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})
export class AuthComponent {

    isLoginMode = true;
    isLoading = false;
    error: string = '';

    constructor(private authService: AuthService, private router: Router) { }

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
            authObservable = this.authService.login(email, password);
        }
        else {
            authObservable = this.authService.signUp(email, password);
        }

        authObservable.subscribe(resData => {
            //console.log(resData);
            this.isLoading = false;
            this.router.navigate(['/recipes']);
        }, errorMessage => {
            console.log(errorMessage);
            this.error = errorMessage;
            this.isLoading = false;
        })
        authForm.reset();
    }
}

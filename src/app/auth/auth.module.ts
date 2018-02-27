import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { AuthComponent } from './auth/auth.component';
@NgModule({
    declarations:[
        AuthComponent,
        SigninComponent,
        SignupComponent
    ],
    imports:[CommonModule,ReactiveFormsModule]
})
export class AuthModule{

}
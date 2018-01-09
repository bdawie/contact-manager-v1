import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl,Validators } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { User } from './../user.model';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signup',
  encapsulation:ViewEncapsulation.Emulated,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupFormGroup:FormGroup;

  firstName:FormControl;
  lastName:FormControl;
  email:FormControl;
  password:FormControl;
  userCreated:Boolean;
  signupFailed:Boolean;
  constructor(private authService:AuthService, private router:Router) { }

  ngOnInit() {
    this.createFormControls();
    this.createFormGroup();
  }

  createFormControls(){
    this.firstName = new FormControl('',Validators.required);
    this.lastName = new FormControl('',Validators.required);
    this.email = new FormControl('',[
      Validators.required,
      Validators.email
    ]);
    this.password = new FormControl('',[
      Validators.required,
      Validators.minLength(8)
    ]);
  }
  createFormGroup(){
    this.signupFormGroup = new FormGroup({
      firstName : this.firstName,
      lastName : this.lastName,
      email : this.email,
      password : this.password
    });
  }
  onSignup(){
    this.signupFailed = false;
    this.userCreated = false;

    const user = new User(
     this.signupFormGroup.value.email,
     this.signupFormGroup.value.password,
     this.signupFormGroup.value.firstName,
     this.signupFormGroup.value.lastName
    );
    this.authService.signup(user)
      .subscribe((data)=>{
        this.userCreated = true;
      },
      (err:HttpErrorResponse) =>{
        this.signupFailed = true;

        if(err instanceof Error){
          console.log('An error occured',err.error.message);
        }
        else{
          console.log(`Backend error. Status code ${err.status}. error body ${err.message}`);
      } 
      },()=>{
        this.signupFormGroup.reset();
      });
  }
}

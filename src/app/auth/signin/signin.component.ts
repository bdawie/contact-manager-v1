import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl,Validators } from '@angular/forms';
import { AuthService } from './../auth.service';
import { User } from './../user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  signinFormGroup:FormGroup;

  email:FormControl;
  password:FormControl;
  loginFailed=false;

  constructor( private authService:AuthService,
               private router:Router) { }

  ngOnInit() {
    this.createFormControls();
    this.createFormGroup();
  }

  createFormControls(){
    this.email = new FormControl('',[
      Validators.required,
      Validators.email
    ]);
    this.password = new FormControl('',Validators.required)
  }
  createFormGroup(){
    this.signinFormGroup = new FormGroup({
      email:this.email,
      password:this.password
    });
  }

  onSignin(){
    const user = new User(
      this.signinFormGroup.value.email,
      this.signinFormGroup.value.password
    );
    this.authService.signin(user)
      .subscribe((data)=>{
        localStorage.setItem('token',data.token);
        localStorage.setItem('userId',data.user['_id']);
        localStorage.setItem('fName',data.user.firstName);
        localStorage.setItem('lName',data.user.lastName);
        location.reload();
        this.router.navigateByUrl('/home');
        
      },(err:HttpErrorResponse)=>{
        this.loginFailed=true;
        if(err instanceof Error){
          console.log('An error occured',err.error.message);
        }
        else{
          console.log(`Backend error. Status code ${err.status}. error body ${err.message}`);
      } 
      });
  }
}

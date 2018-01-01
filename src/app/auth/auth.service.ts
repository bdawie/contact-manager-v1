import { Router } from '@angular/router';
import { Injectable } from "@angular/core";
import {HttpClient,HttpHeaders} from "@angular/common/http";
import { User } from './user.model';

interface UserResponse{
    token:string,
    user:User
}

@Injectable()
export class AuthService{

    headers = new HttpHeaders({'Content-Type':'application/json'});
    constructor(private router:Router, private httpClient:HttpClient){}

    signup(user:User){
        const body = JSON.stringify(user);
        return this.httpClient.post<UserResponse>(
            'http://localhost:3000/user/signup',
            body,
            {headers:this.headers});
    }

    signin(user:User){
        const body= JSON.stringify(user);
        return this.httpClient.post<UserResponse>(
            'http://localhost:3000/user/signin',
             body,
             {headers:this.headers});
    }
    logout(){
        localStorage.clear();
        this.router.navigateByUrl('/');
        location.reload();
        
    }
}
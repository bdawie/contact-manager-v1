import { Injectable } from "@angular/core";
import {HttpClient,HttpHeaders} from '@angular/common/http';
import { Contact } from "./contact.model";
import { HttpErrorResponse } from "@angular/common/http/src/response";
import { Observable } from "rxjs/Observable";
import {tap} from 'rxjs/operators';
import {of} from "rxjs/observable/of";

interface ContactResponse{
    contact:Contact;
}
interface ContactsResponse{
    contacts:Contact[];
}

const token = localStorage.getItem('token');
const headers = new HttpHeaders({
    'Content-Type':'application/json',
    "Authorization":'Bearer '+ token
});
const headerss = new HttpHeaders({
    // 'Content-Type': 'multipart/form-data; boundary=aBoundaryString',
    "Authorization":'Bearer '+ token
});


@Injectable()
export class ContactService{
    contacts:Contact[]=[];

    constructor(private httpClient:HttpClient){}

    createImage(formData:any){
        console.log(formData);
        this.httpClient.post('http://localhost:3000/contact/uploads',formData)
        .subscribe(data=>{
            console.log(data);
        });
    }  
    createContact(formData:any){
        // const body = JSON.stringify(contact);
        const token = localStorage.getItem('token');
       return this.httpClient.post<ContactResponse>(
            'http://localhost:3000/contact',
            formData,
            {headers:headerss})
            .pipe(
                tap(contactData=>{
                    const contact = new Contact(
                        contactData.contact.firstName,
                        contactData.contact.lastName,
                        contactData.contact.phoneNumber,
                        contactData.contact.email,
                        contactData.contact.birthday,
                        contactData.contact.relationship,
                        contactData.contact.jobTitle,
                        contactData.contact.address,
                        contactData.contact.website,
                        contactData.contact.eventTitle,
                        contactData.contact.eventDate,
                        contactData.contact.notes,
                        contactData.contact.pictureUrl,
                        contactData.contact['_id'],
                        contactData.contact['user']['_id']
                        );
                    this.contacts.push(contact);
                    }
            )
        );
    }

    getContacts():Observable<ContactsResponse>{
         let transformedContacts:Contact[]=[];
         const token = localStorage.getItem('token');
         
         return this.httpClient.get<ContactsResponse>('http://localhost:3000/contact',{headers});
    }
    
    updateContact(contactId,formData:FormData){
        // const body = JSON.stringify(contact);
        return this.httpClient.patch<ContactResponse>(`http://localhost:3000/contact/${contactId}`,formData,{headers:headerss});
    }

    deleteContact(contact:Contact){
        this.contacts.splice(this.contacts.indexOf(contact),1);
        return this.httpClient.delete<ContactResponse>(`http://localhost:3000/contact/${contact.contactId}`,{headers});
    }

    searchContacts(term:string):Observable<Contact[]>{
        if(!term.trim()){
            const contacts:Contact[]=[];
            return of(contacts);
        }
        return this.httpClient.get<Contact[]>(`http://localhost:3000/contact/search?name=${term}`,{headers});
    }
    syncContacts(contacts){
        this.contacts=contacts;
    }
    syncContact(contact:Contact){
    }   
}   
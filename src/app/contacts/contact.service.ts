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

@Injectable()
export class ContactService{
    contacts:Contact[]=[];

    constructor(private httpClient:HttpClient){}

    createContact(formData:any,token){
        const headers = new HttpHeaders({
            "Authorization":'Bearer '+ token
        });       
        return this.httpClient.post<ContactResponse>(
            'https://contacts-pro.herokuapp.com/contact',
            formData,
            {headers})
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

    getContacts(token):Observable<ContactsResponse>{
        const tokenHeader = new HttpHeaders({
            "Authorization":'Bearer '+ token
        });

         return this.httpClient.get<ContactsResponse>('https://contacts-pro.herokuapp.com/contact',{headers:tokenHeader});
    }
    
    updateContact(contactId,formData:FormData,token){
        const tokenHeader = new HttpHeaders({
            "Authorization":'Bearer '+ token
        });
        return this.httpClient.patch<ContactResponse>(`https://contacts-pro.herokuapp.com/contact/${contactId}`,formData,{headers:tokenHeader});
    }

    deleteContact(contact:Contact,token){
        const tokenHeader = new HttpHeaders({
            "Authorization":'Bearer '+ token
        });
        this.contacts.splice(this.contacts.indexOf(contact),1);
        return this.httpClient.delete<ContactResponse>(`https://contacts-pro.herokuapp.com/contact/${contact.contactId}`,{headers:tokenHeader});
    }

    searchContacts(term:string,token):Observable<Contact[]>{
        const tokenHeader = new HttpHeaders({
            "Authorization":'Bearer '+ token
        });

        if(!term.trim()){
            const contacts:Contact[]=[];
            return of(contacts);
        }
        return this.httpClient.get<Contact[]>(`https://contacts-pro.herokuapp.com/contact/search?name=${term}`,{headers:tokenHeader});
    }
    syncContacts(contacts){
        this.contacts=contacts;
    }
    syncContact(contact:Contact){
    }   
}   
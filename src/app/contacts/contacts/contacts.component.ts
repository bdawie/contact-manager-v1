import { ContactListComponent } from './../contact-list/contact-list.component';
import { Component,
  OnInit, 
  OnChanges} from '@angular/core';
import {
  HttpErrorResponse, 
  HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import { of} from 'rxjs/observable/of';
import {debounceTime,
    distinctUntilChanged,
    switchMap} from 'rxjs/operators';

import { ContactCreateComponent } from './../contact-create/contact-create.component';
import { ContactSearchEditComponent } from '../contact-search-edit/contact-search-edit.component';
import { ContactService } from './../contact.service';
import { AuthService } from '../../auth/auth.service';
import { Contact } from './../contact.model';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit, OnChanges {

  contacts$:Observable<Contact[]>;
  private searchTerms = new Subject<string>();

  contactCreate = new ContactCreateComponent(null);
  contactSearchEditComponent = new ContactSearchEditComponent(null);
  contactList = new ContactListComponent(null);

  contacts:Contact[];
  isLoading:Boolean=false; 
  
  fisrtName:String;
  lastName:String;
  token:String;
  currentToken;

  selectedSearchContact:Contact;

  constructor(private authService:AuthService,
    private contactService:ContactService,
    private router:Router) { 
      this.currentToken = localStorage.getItem('token');
    }

  ngOnInit() {
              


    if(!localStorage.getItem('token')){
      
     return this.router.navigateByUrl('/');
     
    }

    this.fisrtName=localStorage.getItem('fName');
    this.lastName = localStorage.getItem('lName');
    this.isLoading=true;

    let transformedContacts: Contact[]=[];

    this.contactService.getContacts()
    .subscribe(contactsData=>{
      for(let contactData of contactsData.contacts){
        transformedContacts.push(new Contact(contactData.firstName,
          contactData.lastName,
          contactData.phoneNumber,
          contactData.email,
          contactData.birthday,
          contactData.relationship,
          contactData.jobTitle,
          contactData.address,
          contactData.website,
          contactData.eventTitle,
          contactData.eventDate,
          contactData.notes,
          contactData.pictureUrl,
          contactData['_id'],
          contactData['user']
          ));
      }
      this.isLoading=false;
      this.contacts=transformedContacts;
    },
    (err:HttpErrorResponse)=>{
      
      // if(err.status === 401 && this.currentToken === localStorage.getItem('token')){
      //   console.log('current',this.currentToken);
      //   console.log('new',localStorage.getItem('token'));
      //   localStorage.removeItem('token');
      //   this.router.navigateByUrl('/');
      // }
      
      if(err.error instanceof Error){
          console.log('An error occured',err.error.message);
      }
      else{
        
          console.log(`Backend error. Status code ${err.status}. error body ${err.message}`);
      }
    },()=>{
      
      this.contactService.syncContacts(this.contacts);
    });

    this.contacts$ = this.searchTerms.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term:string)=>this.contactService.searchContacts(term)), 
    );
  }

  ngOnChanges(){
  }

  search(term:string):void{
    this.searchTerms.next(term);
  }

  onSearchedContactClick(contactData){
    let contact = new Contact(
      contactData.firstName,
          contactData.lastName,
          contactData.phoneNumber,
          contactData.email,
          contactData.birthday,
          contactData.relationship,
          contactData.jobTitle,
          contactData.address,
          contactData.website,
          contactData.eventTitle,
          contactData.eventDate,
          contactData.notes,
          contactData.pictureUrl,
          contactData['_id'],
          contactData['user']
    );
    function findId(elem:any):any{
      return elem.contactId === contact.contactId
    }
    const foundIndex = this.contacts.findIndex(findId);
    
    contact = this.contacts[foundIndex];
    console.log(contact);
    
    // contact.firstName="CHANGED";
    // this.contactList.onContactEdit(contact);

     if(this.selectedSearchContact===contact){
    return this.contactSearchEditComponent.openModal();
    }
  this.selectedSearchContact=contact;
  }

  onCreateClick(){
    this.contactCreate.openModal();
  }
  onLogout(){
    this.authService.logout();
  }
}

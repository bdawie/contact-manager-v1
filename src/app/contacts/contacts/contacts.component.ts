import {
  Component,
  OnInit, 
  OnChanges,
  ElementRef,
  ViewChild,DoCheck} from '@angular/core';

  import {
    HttpErrorResponse, 
    HttpClient } from '@angular/common/http';

    import { Router } from '@angular/router';

    import {Observable} from 'rxjs/Observable';
    import {Subject} from 'rxjs/Subject';
    import {of} from 'rxjs/observable/of';
    import {
      debounceTime,
      distinctUntilChanged,
      switchMap} from 'rxjs/operators';
      
import {ContactListComponent}from './../contact-list/contact-list.component';
import { ContactCreateComponent } from './../contact-create/contact-create.component';
import { ContactSearchEditComponent } from '../contact-search-edit/contact-search-edit.component';
import { ContactService } from './../contact.service';
import { AuthService } from '../../auth/auth.service';
import { Contact } from './../contact.model';

import { isString } from 'util';
import {  } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit, OnChanges,DoCheck {

  @ViewChild('relationRef') relationRef:ElementRef;
  @ViewChild('sidebarMenu')  sidebarMenu:ElementRef;
  @ViewChild('contactsList') contactsList:ElementRef;

  contacts$:Observable<Contact[]>;
  private searchTerms = new Subject<string>();

  contactCreate = new ContactCreateComponent(null,null);
  contactSearchEditComponent = new ContactSearchEditComponent(null,null);
  contactList = new ContactListComponent(null);

  contacts:Contact[];
  relations:any[];
  relationCounter = {};
  relationPropertyNames = [];

  isLoading:Boolean=false; 
  emptyContactsList:Boolean;
  
  fisrtName:String;
  lastName:String;
  token:String;
  
  selectedSearchContact:Contact;

  constructor(
    private authService:AuthService,
    private contactService:ContactService,
    private router:Router
  ){ 
    if(!localStorage.getItem('token')){
      this.router.navigateByUrl('/');
     }
     this.token = localStorage.getItem('token');
     this.fisrtName=localStorage.getItem('fName');
     this.lastName = localStorage.getItem('lName');
  }

  ngOnInit() 
  {
    this.sidebarMenu.nativeElement.style.width='300px';
    this.contactsList.nativeElement.style.marginLeft='310px';

    this.getAllContacts();

    this.contacts$ = this.searchTerms.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term:string)=>this.contactService.searchContacts(term,this.token)) 
    );
    
  }
  ngDoCheck(){
    if(this.contacts){
     
      if(this.contacts.length === 0){
        this.emptyContactsList= true;
      }
      else{
        this.emptyContactsList=false;
      }
    }

  }

  ngOnChanges(){
  }

   search(term:string):void{
    this.searchTerms.next(term);
  }

  private onSearchedContactClick(contactData){
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
      return elem.contactId === contact.contactId;
    }
    const foundIndex = this.contacts.findIndex(findId);
    contact = this.contacts[foundIndex];
    
    if(this.selectedSearchContact===contact){
      return this.contactSearchEditComponent.openModal();
    }
    this.selectedSearchContact = contact;
  }

   onCreateClick(){
    this.contactCreate.openModal();
  }

  onLogout(){
    this.authService.logout();
  }

   onAllContactsClick(){
    this.ngOnInit();
  }

  private onRelationsshipsClick(){
    this.getRelationships();
  }
 private onRelationSelect(element){
   this.isLoading=true;

    let transformedContacts: Contact[]=[];
    this.contactService.getContacts(this.token)
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
      const sameRelation = transformedContacts.filter(contact=>{
        const rel = contact.relationship.charAt(0).toUpperCase() + contact.relationship.slice(1);
        return rel === element.srcElement.innerText.trim();
      });
      this.isLoading=false;

      this.contacts=sameRelation;
    });
  }

   onMenubarClick(){
    if(this.sidebarMenu.nativeElement.style.width === '0px'){

      this.sidebarMenu.nativeElement.style.width='300px';
      this.contactsList.nativeElement.style.marginLeft="310px";
    }
    else{
      this.sidebarMenu.nativeElement.style.width='0px';
      this.contactsList.nativeElement.style.marginLeft="0px";
    }
  }

  private getAllContacts(){
    
    
    this.isLoading=true;
    this.emptyContactsList=false;

    let transformedContacts: Contact[]=[];

    this.contactService.getContacts(this.token)
    .subscribe(contactsData=>{
      if(contactsData.contacts.length===0){
        this.emptyContactsList=true;
      }
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
      this.isLoading = false;
      this.contacts = transformedContacts;
    },
    (err:HttpErrorResponse)=>{
      if(err.status === 401){
        localStorage.clear();
        this.router.navigateByUrl('/');
      }
      
      if(err.error instanceof Error){
          console.log('An error occured',err.error.message);
      }
      else{
        
          console.log(`Backend error. Status code ${err.status}. error body ${err.message}`);
      }
    },()=>{
      this.contactService.syncContacts(this.contacts);
      this.getRelationships();

    });
  
  }
  private getRelationships(){
    
    this.relationPropertyNames=[];
    this.relations=[];
    this.relationCounter={};

    this.relations = this.contacts.filter(contact=>{
      if(isString(contact.relationship) && contact.relationship.length > 0){
        return true;
      }
      return false;
    });

    if(this.relations.length > 0){

      this.relations.map(relation=>{
        if( Object.keys(this.relationCounter).length === 0){
          const rel = relation.relationship.charAt(0).toUpperCase() + relation.relationship.slice(1);
          this.relationCounter[rel] = 1;
        }
        else{
          for(let prop in this.relationCounter ){
            if(prop.toLowerCase() === relation.relationship.toLowerCase()){
              this.relationCounter[prop]++;
              }
            else{
              const rel = relation.relationship.charAt(0).toUpperCase() + relation.relationship.slice(1);
              this.relationCounter[rel] = 1;
            }
          }  
        }
      });
    }
    
    for(let relation in this.relationCounter){
      this.relationPropertyNames.push(relation);
    }
  }
}

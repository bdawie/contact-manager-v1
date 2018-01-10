import {HttpErrorResponse} from '@angular/common/http';
import { ContactService } from './../contact.service';
import { ContactComponent } from './../contact/contact.component';
import { Contact } from './../contact.model';
import { Component, OnInit, Input } from '@angular/core';
declare let jquery:any;
declare let $:any;

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})

export class ContactListComponent implements OnInit {
  @Input('contacts') contacts:Contact[];

  selectedContact:Contact;
  deletedContact:Contact;
  isContactDeleted:Boolean;
  emptyContactsList:Boolean;
  contactImage:String;
  token:String;


  
  constructor(private contactService:ContactService) {
    this.token = localStorage.getItem('token');
   }

  contactComponent = new ContactComponent(null,null);

  onContactEdit(contact){
     if(this.selectedContact===contact){
     return this.contactComponent.openModal();
     }
    this.selectedContact=contact;
  }
  onContactDelete(contact){
    this.isContactDeleted=false;
    this.contactService.deleteContact(contact,this.token)
    .subscribe((data)=>{
      this.isContactDeleted=true;
    },(err:HttpErrorResponse)=>{
      console.log(err.message);
    },()=>{
      setTimeout(()=>{
        this.isContactDeleted=false;
      },2500);
    });
    
  }
  ngOnInit() {
    
   
  }

}

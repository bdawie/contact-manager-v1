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

  
  constructor(private contactService:ContactService) { }

  contactComponent = new ContactComponent(null);

  onContactEdit(contact){
     if(this.selectedContact===contact){
     return this.contactComponent.openModal();
     }
    this.selectedContact=contact;
  }
  onContactDelete(contact){
    this.contactService.deleteContact(contact)
    .subscribe((data)=>{
      this.isContactDeleted=true;
    });
    this.isContactDeleted=false;
  }
  ngOnInit() {
  }

}

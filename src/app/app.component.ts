import { ContactCreateComponent } from './contacts/contact-create/contact-create.component';
import { Component, OnInit } from '@angular/core';
import { ContactService } from './contacts/contact.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  contactCreateComponent:ContactCreateComponent;
  constructor(){}

  ngOnInit(){
    this.contactCreateComponent = new ContactCreateComponent(null);
    
  }


  onCreateClick(){
    console.log('hi');
    this.contactCreateComponent.openModal();   
  }
}

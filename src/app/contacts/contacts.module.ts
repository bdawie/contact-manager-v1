import { SharedComponent } from './../shared/shared.component';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';

import { ContactSearchEditComponent } from './contact-search-edit/contact-search-edit.component';
import { ContactCreateComponent } from './contact-create/contact-create.component';
import { ContactComponent } from './contact/contact.component';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactsComponent } from './contacts/contacts.component';
import { SidebarMenuComponent } from './sidebar-menu/sidebar-menu.component';
import { ContactService } from './contact.service';
@NgModule({
    declarations:[
        SidebarMenuComponent,
        ContactsComponent,
        ContactListComponent,
        ContactComponent,
        ContactCreateComponent,
        ContactSearchEditComponent,
        SidebarMenuComponent,
        SharedComponent
    ],
    imports:[
        CommonModule,
        ReactiveFormsModule
    ],
    providers:[ContactService]
})
export class ContactsModule{

}
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import { ReactiveFormsModule} from '@angular/forms';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { SharedComponent } from './shared/shared.component';
import { ContactCreateComponent } from './contacts/contact-create/contact-create.component';
import { AuthService } from './auth/auth.service';
import { ContactService } from './contacts/contact.service';
import { ContactComponent } from './contacts/contact/contact.component';
import { ContactListComponent } from './contacts/contact-list/contact-list.component';
import { ContactsComponent } from './contacts/contacts/contacts.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthComponent } from './auth/auth/auth.component';
import { SigninComponent } from './auth/signin/signin.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { routing } from './app.routing';
import { ContactSearchEditComponent } from './contacts/contact-search-edit/contact-search-edit.component';


@NgModule({
  declarations: [
    AppComponent,
    SharedComponent,
    ContactCreateComponent,
    ContactComponent,
    ContactListComponent,
    ContactsComponent,
    SignupComponent,
    AuthComponent,
    SigninComponent,
    LogoutComponent,
    ContactSearchEditComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    routing
  ],
  providers: [ContactService,AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }

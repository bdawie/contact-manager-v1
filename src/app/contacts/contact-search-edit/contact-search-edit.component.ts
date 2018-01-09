import {
  Component, 
  OnInit, 
  Input,
  OnChanges,
  DoCheck,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  SimpleChanges} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

import * as moment from 'moment'; 

declare var jquery:any;
declare var $ :any; 

@Component({
  selector: 'app-contact-search-edit',
  templateUrl: './contact-search-edit.component.html',
  styleUrls: ['./contact-search-edit.component.css']
})
export class ContactSearchEditComponent implements OnInit,OnChanges {

  @Input('searchedContact') contact:Contact;
  @ViewChild('searchedContactPhotoEditInput') searchedContactPhotoEditInput:ElementRef;


  editContactForm : FormGroup;

  firstName : FormControl;
  lastName : FormControl;
  phoneNumber : FormControl;
  email : FormControl;
  birthday : FormControl;
  relationship : FormControl;
  jobTitle : FormControl;
  address : FormControl;
  website : FormControl;
  eventTitle : FormControl;
  eventDate : FormControl;
  notes : FormControl;
  pictureUrl : FormControl;

  contactImage:string;
  token:String;

  constructor(private contactService:ContactService) { 
    this.token = localStorage.getItem('token');
    this.createFormControls();
    this.createForm();
  }

  ngOnChanges(changes:SimpleChanges){
    console.log(this.contact);
    console.log(this.contact.pictureUrl);
    if (this.contact.pictureUrl === '' || this.contact.pictureUrl === null || this.contact.pictureUrl === undefined){
      this.clearFile();
      this.contactImage ='http://ssl.gstatic.com/s2/oz/images/sge/grey_silhouette.png';
    } else{
      this.contactImage = this.contact.pictureUrl
      }

    // convert to DOM date format
    const birthdayDate= moment(this.contact.birthday).format('YYYY-MM-DD');

    this.editContactForm.reset({
      firstName : this.contact.firstName,
      lastName : this.contact.lastName,
      phoneNumber : this.contact.phoneNumber,
      email: this.contact.email,
      birthday : birthdayDate,
      relationship :this.contact.relationship,
      jobTitle : this.contact.jobTitle,
      address : this.contact.address,
      website : this.contact.website,
      eventTitle : this.contact.eventTitle,
      eventDate : this.contact.eventDate,
      notes : this.contact.notes,
    });
    if(changes){
      this.openModal();
    }
  }

  ngOnInit() {
   
  }
  
  private createFormControls(){
    this.firstName= new FormControl('',Validators.required);
    this.lastName=new FormControl('',Validators.required);
    this.phoneNumber = new FormControl('',Validators.required);
    this.email=new FormControl('',[
      Validators.required,
      Validators.email
    ]);
    this.birthday = new FormControl('');
    this.relationship = new FormControl('');
    this.jobTitle = new FormControl('');
    this.address = new FormControl('');
    this.website = new FormControl('');
    this.eventTitle = new FormControl('');
    this.eventDate = new FormControl('');
    this.notes = new FormControl('');
    this.pictureUrl = new FormControl('');
  }
  private createForm(){
    this.editContactForm = new FormGroup({
      firstName : this.firstName,
      lastName : this.lastName,
      phoneNumber : this.phoneNumber,
      email: this.email,
      birthday : this.birthday,
      relationship :this.relationship,
      jobTitle : this.jobTitle,
      address : this.address,
      website : this.website,
      eventTitle : this.eventTitle,
      eventDate : this.eventDate,
      notes : this.notes,
      pictureUrl : this.pictureUrl
    });
  }

  private createFormData():FormData{
    const files = this.searchedContactPhotoEditInput.nativeElement.files;
    const file = files[0];
    const formData= new FormData();  

    formData.append('firstName',this.editContactForm.value.firstName);
    formData.append('lastName', this.editContactForm.value.lastName);
    formData.append ('phoneNumber',this.editContactForm.value.phoneNumber);
    formData.append ('email',this.editContactForm.value.email);
    formData.append('birthday', this.editContactForm.value.birthday);
    formData.append ('relationship',this.editContactForm.value.relationship);
    formData.append('jobTitle', this.editContactForm.value.jobTitle);
    formData.append('address', this.editContactForm.value.address);
    formData.append ('website', this.editContactForm.value.website);
    formData.append('eventTitle', this.editContactForm.value.eventTitle);
    formData.append ('eventDate',this.editContactForm.value.eventDate);
    formData.append('notes', this.editContactForm.value.notes);
    if(file){
      formData.append('contactPic',file,file.name);
    }

    return formData;
 }  

 private changeThisContact(){
  this.contact.firstName = this.editContactForm.value.firstName;
  this.contact.lastName = this.editContactForm.value.lastName;
  this.contact.phoneNumber=  this.editContactForm.value.phoneNumber;
  this.contact.email = this.editContactForm.value.email;
  this.contact.birthday  =  this.editContactForm.value.birthday;
  this.contact.relationship  =  this.editContactForm.value.relationship;
  this.contact.jobTitle   =this.editContactForm.value.jobTitle;
  this.contact.address   = this.editContactForm.value.address;
  this.contact.website   = this.editContactForm.value.website;
  this.contact.eventTitle   = this.editContactForm.value.eventTitle;
  this.contact.eventDate   = this.editContactForm.value.eventDate;
  this.contact.notes   = this.editContactForm.value.notes;
 }

   onEditSubmit(){
    this.changeThisContact();
    const formData = this.createFormData();

    this.contactService.updateContact(this.contact.contactId,formData,this.token)
        .subscribe((data)=>{
          this.contact.pictureUrl=data.contact.pictureUrl;
        },
      (err:HttpErrorResponse)=>{
        if(err instanceof Error){
          console.log('An error occured',err.error.message);
        }
        else{
          console.log(`Backend error. Status code ${err.status}. error body ${err.message}`);
          console.log(err);
      }
      },()=>{
        this.closeModal();
        this.ngOnChanges(null);
      });
  }

   onEditModalClose(){
    $("#editFirstNameSearchInput").focus();
    this.ngOnChanges(null);
    // if(this.contactImage === ''){
    //   this.clearFile();
    // }
  }

   onPhotoChange(searchedContactPhotoEditInput){
    if(searchedContactPhotoEditInput.files && searchedContactPhotoEditInput.files[0]){
      const reader = new FileReader();
      reader.onload = function(e:any){
        $("#contactPhotoSearchEditImg").attr('src',e.target.result);
      };
      reader.readAsDataURL(searchedContactPhotoEditInput.files[0]);
    }
  }
   clearFile() {
    this.searchedContactPhotoEditInput.nativeElement.value = '';
    $("#contactPhotoSearchEditImg").attr('src','http://ssl.gstatic.com/s2/oz/images/sge/grey_silhouette.png');

  }
  public openModal(){
    $("#searchedContactEditModal").modal('show');
    $("#editFirstNameSearchInput").focus();
  }
  closeModal(){
    $("#editFirstNameSearchInput").focus();
    $("#searchedContactEditModal").modal('hide');
  }
} 
  
   
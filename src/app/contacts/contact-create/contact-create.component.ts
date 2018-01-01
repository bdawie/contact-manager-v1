import { Component, OnInit, ViewChild,ElementRef } from '@angular/core';
import {FormGroup,FormControl, Validators} from '@angular/forms';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
declare var jquery:any;
declare var $ :any; 
@Component({
  selector: 'app-contact-create',
  templateUrl: './contact-create.component.html',
  styleUrls: ['./contact-create.component.css']
})
export class ContactCreateComponent implements OnInit {

  @ViewChild('contactPhotoCreateInput') contactPhotoCreateInput:ElementRef;
  createContactForm:FormGroup;
  isLoading:Boolean=false;

  constructor(private contactService : ContactService) { }
  
  public openModal(){
    $("#createContactModal").modal('show');
  }
  private createFormData(){
     const files = this.contactPhotoCreateInput.nativeElement.files;
     const file = files[0];
     
    const formData= new FormData();  
     formData.append('firstName',this.createContactForm.value.firstName);
     formData.append('lastName', this.createContactForm.value.lastName);
     formData.append ('phoneNumber',this.createContactForm.value.phoneNumber);
     formData.append ('email',this.createContactForm.value.email);
     formData.append('birthday', this.createContactForm.value.birthday);
     formData.append ('relationship',this.createContactForm.value.relationship);
     formData.append('jobTitle', this.createContactForm.value.jobTitle);
     formData.append('address', this.createContactForm.value.address);
     formData.append ('website', this.createContactForm.value.website);
     formData.append('eventTitle', this.createContactForm.value.eventTitle);
     formData.append ('eventDate',this.createContactForm.value.eventDate);
     formData.append('notes', this.createContactForm.value.notes);
     if(file){
      formData.append('contactPic',file,file.name);
     }
     return formData;
  }
  private clearFile() {
    this.contactPhotoCreateInput.nativeElement.value = '';
    $("#contactPhotoCreateImg").attr('src','http://ssl.gstatic.com/s2/oz/images/sge/grey_silhouette.png');
  }

  onCreateSubmit(){
     const formData = this.createFormData();
     this.isLoading=true;
    //  this.contactService.createImage(formData);
    // const contact = new Contact(
    //   this.createContactForm.value.firstName,
    //   this.createContactForm.value.lastName,
    //   this.createContactForm.value.phoneNumber,
    //   this.createContactForm.value.email,
    //   this.createContactForm.value.birthday,
    //   this.createContactForm.value.relationship,
    //   this.createContactForm.value.jobTitle,
    //   this.createContactForm.value.address,
    //   this.createContactForm.value.website,
    //   this.createContactForm.value.eventTitle,
    //   this.createContactForm.value.eventDate,
    //   this.createContactForm.value.notes,
    //   );
    this.contactService.createContact(formData)
    .subscribe(contact=>{
      console.log('Created Successfulyy!');
      this.isLoading=false;
    },(err=>{
      console.log(err);
    }),()=>{
      this.createContactForm.reset();
      this.clearFile();
      $("#createFirstNameInput").focus();
    });
    

  }
  onPhotoChange(contactPhotoCreateInput){
    
    if(contactPhotoCreateInput.files && contactPhotoCreateInput.files[0]){
      const reader = new FileReader();
      reader.onload = function(e:any){
        $("#contactPhotoCreateImg").attr('src',e.target.result);
      };
      reader.readAsDataURL(contactPhotoCreateInput.files[0]);
    }
  }
  onCreateModalClose(){
    $("#createFirstNameInput").focus();
    this.clearFile();
    this.createContactForm.reset();

  }
  
  ngOnInit() {
    this.createContactForm = new FormGroup({
      firstName: new FormControl('',Validators.required),
      lastName:new FormControl('',Validators.required),
      phoneNumber : new FormControl('',Validators.required),
      email: new FormControl('',[
        Validators.required,
        Validators.email
      ]),
      birthday : new FormControl(''),
      relationship : new FormControl(''),
      jobTitle : new FormControl(''),
      address : new FormControl(''),
      website : new FormControl(''),
      eventTitle : new FormControl(''),
      eventDate : new FormControl(''),
      notes : new FormControl(''),
      pictureUrl : new FormControl('')
    });
  }

}

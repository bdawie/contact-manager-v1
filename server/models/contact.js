const mongoose = require('mongoose');
const User = require('./user');

const Schema = mongoose.Schema;

const contactSchema = new Schema({
    firstName:{type:String,required:true},
    lastName:{type:String,required:true},
    phoneNumber:{type:String,required:true},
    email:{type:String},
    birthday:{type:String},
    relationship:{type:String},
    jobTitle:{type:String},
    address:{type:String},
    website:{type:String},
    eventTitle:{type:String},
    eventDate:{type:String},
    notes:{type:String},
    pictureUrl:{type:String},
    user:{type:Schema.Types.ObjectId,ref:'User',required:true}
});
contactSchema.post('remove',(contact)=>{
   
    User.findById(contact.user,(err,user)=>{
        console.log('removed Succesfuly!');
        user.contacts.pull(contact);
        user.save();
    })
});

module.exports = mongoose.model('Contact',contactSchema);
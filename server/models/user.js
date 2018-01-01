const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');

const Schema= mongoose.Schema;

const userSchema = new Schema({
    firstName : {type:String,required:true},
    lastName : {type:String,required:true},
    email :{type:String,required:true,unique:true},
    password : {type:String,required:true},
    contacts: [{type:Schema.Types.ObjectId,ref:'Contact'}]
});

userSchema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('User',userSchema);
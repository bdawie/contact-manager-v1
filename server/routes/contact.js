
const express = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination:'./images-uploads',
    filename: function (req, file, cb) {
        cb(null, new Date().getTime() + 'created' + file.originalname);
      }
});
const fileFilter = (req,file,cb)=>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null,true);
    }
    else{
        cb(null,false);
    }
}

const upload = multer({storage,fileFilter});

const Contact = require('../models/contact');
const User = require('../models/user');

const router = express.Router();
const secretKey = 'secretkeymanager'



router.get('/',getToken,(req,res)=>{
    jwt.verify(req.token,secretKey,(err,decoded)=>{
        if(err){
            return res.status(401).json({
                title:'Not auhtorized!',
                error:err
            });
        }
        Contact.find({user:decoded.userId},(err,contacts)=>{
            if(err){
                return res.status(500).json({
                    error:{
                        message:'An error occured',
                        error:err
                    }
                });
            }
            res.status(200).json({
                contacts
            });
        });
    });
});

router.get('/search',getToken,(req,res,next)=>{
    jwt.verify(req.token,secretKey,(err,decodedUser)=>{
        if(err){
            return res.status(401).json({
                title:'Not auhtorized!',
                error:err.message
            });
        }
        const name= req.query.name;
   
        Contact.find({ $and:[
            {$text:{$search:name}},
            {user:decodedUser.userId}
        ]})
        .exec()
        .then(contacts=>{
            res.status(200).json(
                contacts
            );
        })
        .catch(err=>{
            res.status(500).json({
                title:'An error occured',
                error:err
            });
        });
    });
});

router.post('/',getToken,upload.single('contactPic'),(req,res)=>{
    jwt.verify(req.token,secretKey,(err,decoded)=>{
        if(err){
            return res.status(401).json({
                title:'Not auhtorized!',
                error:err
            });
        }
        console.log(req.file);
        let imageUrl;
        if(req.file){
            imageUrl = req.file.path;
        }
        else{
            imageUrl = '';
        }
        User.findById(decoded.userId)
        .exec()
        .then(user=>{
            const contact = new Contact({
                firstName : req.body.firstName,
                lastName : req.body.lastName,
                phoneNumber: req.body.phoneNumber,
                email: req.body.email,
                birthday: req.body.birthday,
                relationship: req.body.relationship,
                jobTitle: req.body.jobTitle,
                address: req.body.address,
                website: req.body.website,
                eventTitle: req.body.eventTitle,
                eventDate: req.body.eventDate,
                notes: req.body.notes,
                pictureUrl: imageUrl,
                user:user
            });
            contact.save((err,contact)=>{
                if(err) {
                    return res.status(500).json({
                        error:{
                            message:'An error occured',
                            error:err.message
                        }
                    });
                }
                res.status(201).json({
                    contact
                });
                user.contacts.push(contact);
                user.save();
            });
        })
        .catch(err=>{
            res.status(500).json({
                title:'An error occured!',
                error:err.message
            });
        });
    });
});

// router.post('/uploads',upload.single('contactPic'),(req,res)=>{
//     console.log('image',req.file);
//     res.status(201);
// });

router.patch('/:id',getToken,upload.single('contactPic'),(req,res)=>{
    jwt.verify(req.token,secretKey,(err,decoded)=>{
        if(err){
            return res.status(401).json({
                title:'Not auhtorized!',
                error:err
            });
        }
        const contactId= req.params.id;
        const body = req.body;
        let imageUrl;
        Contact.findById(contactId)
        .exec()
        .then(contact=>{
            if(!contact){
                return res.status(404).json({
                    message:'Contact not found!'
                });
            }
            if(req.file){
                fs.unlink(contact.pictureUrl,(err)=>{
                    if(err) console.log(err.message);
                    console.log('Removed old file!');
                });
                imageUrl = req.file.path;
            }
            else{
                imageUrl = contact.pictureUrl;
            }
            contact.firstName= body.firstName;
            contact.lastName = body.lastName;
            contact.phoneNumber = body.phoneNumber;
            contact.email = body.email;
            contact.birthday = body.birthday;
            contact.relationship = body.relationship;
            contact.jobTitle = body.jobTitle;
            contact.address = body.address;
            contact.website = body.website;
            contact.eventTitle = body.eventTitle;
            contact.eventDate = body.eventDate;
            contact.notes = body.notes;
            contact.pictureUrl = imageUrl
            contact.save((err,savedContact)=>{
                if(err){
                    return res.status(500).json({
                        title:'An error occured',
                        error:err.message
                    });
                }
                res.status(201).json({
                    message:'Contact successfuly updated',
                    contact:savedContact
                });
            });
        })
        .catch(err=>{
            res.status(500).json({
                message:'An error occured',
                error:err.message
            });
        });
    });    
});

router.delete('/:id',getToken,(req,res)=>{
    jwt.verify(req.token,secretKey,(err,decoded)=>{
        if(err){
            return res.status(401).json({
                title:'Not auhtorized!',
                error:err
            });
        }
        const contactId = req.params.id;
        Contact.findById(contactId)
        .then((contact)=>{
            if(!contact){
                return res.status(404).json({
                    error:{
                        message:'Contact not found'
                    }
                });
            }
            return contact.remove();
        })
        .then((contact)=>{
            res.status(200).json({
                contact
            });
        })
        .catch((error)=>{
            res.status(500).json({
                message:'An error occured',
                error:error
            });
        });
    });     
});

// get token from Authoriztion header
function getToken(req,res,next){
    const bearerHeader =req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        console.log(bearerToken);
        next();
    }
    else{
        res.status(401).json({
            title:'Not authorized!',
            message:'Invalid token'
        });
    }
}

module.exports = router;
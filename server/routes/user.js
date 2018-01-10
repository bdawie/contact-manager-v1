const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();
const User = require('../models/user');

router.post('/signup',(req,res)=>{
    bcrypt.hash(req.body.password,10,(err,hash)=>{
        if(err){
            return res.status(500).json({
                title:'An error occured!',
                error:err.message
            });
        }
        const user = new User({
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            email:req.body.email,
            password:hash
            });
        user.save()
        .then((user)=>{
            res.status(201).json({
                 message:'User created successfuly!',
                user
                });
        })
        .catch((err)=>{
            res.status(500).json({
                message:'An error occured',
                error:err
                });
        });
    });
});

router.post('/signin',(req,res)=>{
    User.findOne({email:req.body.email}).then((user)=>{
        if(!user){
            return res.status(401).json({
               error:{
                   title:'Sign in failed! Not authorized!',
                   message:'Invalid sign in credentials'
               } 
            });
        }
        bcrypt.compare(req.body.password,user.password,(err,success)=>{
            if(err){
                return res.status(401).json({
                    error:{
                        title:'Sign in failed! Not authorized!',
                        message:'Invalid sign in credentials'
                    }
                });
            }
            const token = jwt.sign({
                firstName:user.firstName,
                lastName:user.lastName,
                userId:user._id
            },'secretkeymanager',{expiresIn:'3h'});
            res.status(200).json({
                message:'Successfuly signed in!',
                token,
                user
            });
        });        
    })
    .catch((err)=>{
        res.status(500).json({
            error:{
                title:'An error occured',
                message:err.message
            }
        });
    });
});

module.exports = router;
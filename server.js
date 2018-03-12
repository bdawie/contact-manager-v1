const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const http = require('http');
const contactRouter = require('./server/routes/contact');
const userRouter = require('./server/routes/user');

const app = express();

mongoose.connect('mongodb://USER_DB:PASS_WORD@mongodb-atlas-shard-00-00-azmum.mongodb.net:27017,mongodb-atlas-shard-00-01-azmum.mongodb.net:27017,mongodb-atlas-shard-00-02-azmum.mongodb.net:27017/contacts-manager?ssl=true&replicaSet=mongodb-atlas-shard-0&authSource=admin',{useMongoClient:true});
mongoose.Promise = global.Promise;

const port = process.env.PORT || 3000;

// Morgan Logger middleware
app.use(morgan('dev'));
// Send static files
app.use(express.static(path.join(__dirname,'dist')));
app.use(express.static(path.join(__dirname,'static')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


// Middleware for allowing CORS
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method==='OPTIONS'){
        res.header('Access-Control-Allow-Methods','POST, GET, PATCH, DELETE, PUT');
        return res.status(200).json({});
    }

    next();
})

app.use('/contact',contactRouter);
app.use('/user',userRouter);

app.use('/',(req,res,next)=>{
    res.sendfile(path.join(__dirname,'dist/index.html'));
});

// Send index.html for all other requests!
app.get('*',(req,res,next)=>{
     res.sendfile(path.join(__dirname,'dist/index.html'));
});

app.use((req,res,next)=>{
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});
// Error Handler 
app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message : error.message
        }
    });
});
// Create a server
const server = http.createServer(app);

// Listening on specified port
server.listen(port,()=>{
    console.log(`Listening on port ${port}`);
})

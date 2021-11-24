require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

//global middlewares, use app.use();
//this tells, run the middleware always before any route.

app.use(middleware1);
//we can add as many as we want
//middlewares are executed in order of app.use() call, and then whatever we have on our specific routes
app.use(cors());

//comment these out if wanted
app.use(middlewareWithError);
//middleware error handler should be at the end. if it was created
app.use(errorHandler);



app.get('/', (req,res, next)=>{
    //res.locals.passed from middleware1
    res.send("Hi " + res.locals.name);
})

//middleware
function standardExpressCalback (requestObject, responseObject, nextMiddleware){
    console.log("I'm the standard express function.")
    responseObject.send("Hi");
}

//using custom standard express callback
app.get('/hi2', standardExpressCalback);

//just like that we can set middleware
function middleware1(req,res,next){
    console.log("I'm a middleware #1");
    //next(); is needed as tells express, to now execute next middleware or callback

    //if you want to pass stuff to next middleware
    res.locals.name ="alan";
    //req.customPropery = "alan2";// locals is the preferred and best practices method.
    next();
}


//this is an example of route specific middleware!
//express lets you call as many middlewares as you want
app.get('/hi3', middleware2, standardExpressCalback);


function middleware2(req,res,next){
    console.log("I'm a middleware #2");
    //next(); is needed as tells express, to now execute next middleware or callback
    next();
}

function errorHandler(err, req, res, next){
    if(err){
        // res.send("there was an error, please try again");
        res.json({err: err});
    }
}

function middlewareWithError(req,res,next){
    console.log("I'm a middleware #3");
    // send error to next()
    const errorObj = new Error("Something wrong happened");
    next(errorObj);
}



const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log("we live brothers" + " hosted by " + process.env.MYNAME + " on port: " + PORT);
})
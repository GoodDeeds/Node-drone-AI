var http = require("http"),
    drone = require("dronestream");
var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var arDrone = require('ar-drone');
var client = arDrone.createClient();
var morgan =require('morgan');
var routes = require('./routes')
var currentx, currenty, targetx, targety;
const midX=150;//Current x cooordinate of drone
const midY=75;//Current y coordinate

var isAirborne=0; //0 if on ground, 1 if airborne

var port=5555;
var app=express();

var server=http.createServer(app,function(){
    require("fs").createReadStream(__dirname + "/index.html").pipe(res);
});

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.get('/',routes.index);

var router=express.Router();
app.post('/newcommand', function(req,res){
   
       // console.log(req.body); 
    currentx=midX;
    currenty=midY;
    targetx=req.query.x;
    targety=req.query.y;
    console.log("x="+targetx+", y="+targety);
    
});

app.post('/takeoff', function(req,res){
    if(isAirborne){
        console.log("Already in the air");
        
        
    }
    else{
        //Need to ensure that takeoff is possible, not yet done
        
           console.log("Taken off"); 
            isAirborne=1;
           
    }
});


app.post('/land', function(req,res){
   if(!isAirborne){
       console.log("Already landed");
   }
    else{ 
        //Need to ensure that terrain is suitable, not yet done
       
           console.log("Landed");
            isAirborne=0;
        
    }
});



/*var server = http.createServer(function(req, res) {
  require("fs").createReadStream(__dirname + "/index.html").pipe(res);
});

drone.listen(server);*/

/*app.listen(port, function(req,res){
    console.log("Server running");
});*/

drone.listen(server);//Check if this works

server.listen(port);

//server.listen(5555);


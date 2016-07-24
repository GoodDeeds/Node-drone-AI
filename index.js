var http = require("http"),
    drone = require("dronestream");
var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var arDrone = require('ar-drone');
var client = arDrone.createClient();

var currentx, currenty, targetx, targety;
const var midX=150;//Current x cooordinate of drone
const var midY=75;//Current y coordinate
const var SPEED_FORWARD;
const var TIME_90_DEGREES;
const var TIME_180_DEGREES;
const var TIME_FORWARD_COORDINATE;//Time to go forward one coordinate
const var TIME_SIDE_COORDINATE;//Sideways
const var TIME_UP_COORDINATE;//Up-down
const var SPEED_SIDE;
const var SPEED_UP;

var isAirborne=0; //0 if on ground, 1 if airborne

var port=5555;
var app=express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(morgan('dev'));

var route=express.Router();
router.route('/')
.post(function(req,res){
   
        console.log(req.body); 
    currentx=midX;
    currenty=midY;
    targetx=req.body.x;
    targety=req.body.y;
    navigate(targetx-currentx, targety-currenty);
    
});

app.use('/newcommand',router);

router.route('/')
.post(function(req,res){
    if(isAirborne){
        console.log("Already in the air");
        
        
    }
    else{
        //Need to ensure that takeoff is possible, not yet done
        client.takeoff(function(){
           console.log("Taken off"); 
            isAirborne=1;
        });
    }
});

app.use('/takeoff',router);

router.route('/')
.post(function(req,res){
   if(!isAirborne){
       console.log("Already landed");
   }
    else{ 
        //Need to ensure that terrain is suitable, not yet done
        client.land(function(){
           console.log("Landed");
            isAirborne=0;
        });
    }
});

app.use('/land',router);

/*var server = http.createServer(function(req, res) {
  require("fs").createReadStream(__dirname + "/index.html").pipe(res);
});

drone.listen(server);*/

app.listen(port, function(){
    drone.listen(app);//Check if this works
    require("fs").createReadStream(__dirname + "/index.html").pipe(res);
});

//server.listen(5555);

function navigate(diffRight, diffDown){
    //Need algorithm to navigate, and ensure that multiple commands don't cause random motion
    if(!isAirborne){
        console.log("Need to takeoff first");
        return;
    }
    //Incomplete
    while(!isObstacle("front")){
        client.front(SPEED_FORWARD);
        client.after(TIME_FORWARD_COORDINATE,function(){
            this.stop();
        });
        
    }
}

//Return whether it is safe to move in given direction or not
function isObstacle(direction){
    if(direction=="front"){
        //Get sensor data from front, front left, and front right sensors
    }
    else if(direction=="rear"){
        //Get sensor data from rear, rear left, and rear right sensors
    }
    else if(direction=="left"){
        //Get sensor data from front left, back left sensors
    }
    else if(direction=="right"){
        //Get sensor data from front right, back right sensors
    }
    else if(direction=="up"){}//What if direction is up? Do we keep another sensor on the top
    else if(direction=="down"){
        //Get data from built-in sensor
    }
}
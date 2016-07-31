var http = require("http"),
    drone = require("dronestream");
var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var arDrone = require('ar-drone');
var client = arDrone.createClient();
var morgan = require('morgan');
var app = express();
var routes = require('./routes');
var path= require('path');
var async = require('async');
var currentx, currenty, targetx, targety, distance = {}, side;
const midX=320;//Current x cooordinate of drone
const midY=180;//Current y coordinate
const SPEED_FORWARD=0.3;
const TIME_90_DEGREES=10;
//const TIME_180_DEGREES=0;
const TIME_FORWARD_COORDINATE=10;//Time to go forward one coordinate
const TIME_SIDE_COORDINATE=10;//Sideways
const TIME_UP_COORDINATE=10;//Up-down
const SPEED_SIDE=0.3;
const SPEED_UP=0.3;
//const FORWARD_COORDINATE=0;
const SPEED_SPIN=0.3;
//const THRESHOLD_DISTANCE=0;

var clickEnabled=1;

var isAirborne=0; //0 if on ground, 1 if airborne

var server=http.createServer(app);


    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade', { pretty: true });
   // app.use(favicon());
   // app.use(logger('dev'));
	app.use(express.static(path.join(__dirname, 'public')));


drone.listen(server);
server.listen(3000);

app.get('/',routes.index);

var router=express.Router();
app.post('/newcommand', function(req,res){

       // console.log(req.body);
    currentx=midX;
    currenty=midY;
    targetx=req.query.x;
    targety=req.query.y;
    if(clickEnabled){
      clickEnabled=0;
      navigate(targetx-currentx, targety-currenty, function(){
        clickEnabled=1;
      });

    }

});

app.post('/takeoff', function(req,res){
    if(clickEnabled){
      clickEnabled=0;
      //Need to ensure that takeoff is possible, not yet done
      client.takeoff(function(){
            clickEnabled=1;
            console.log("Taken off");
            isAirborne=1;
            res.end(JSON.stringify({"clickEnabled": clickEnabled}));

        });
    }
    else{
      res.end(JSON.stringify({"clickEnabled": clickEnabled}));
    }

  });


  app.post('/land', function(req,res){
      //Need to ensure that terrain is suitable, not yet done
      if(clickEnabled){
        clickEnabled=0;
        client.land(function(){
            clickEnabled=1;
            console.log("Landed");
            isAirborne=0;
            res.end(JSON.stringify({"clickEnabled": clickEnabled}));
        });
      }
      else{
        res.end(JSON.stringify({"clickEnabled": clickEnabled}));
      }




});
app.post('/clockwise', function(req,res){
    //Need to ensure that terrain is suitable, not yet done
    client.clockwise(SPEED_SPIN);
    client.after(TIME_90_DEGREES, function(){
    this.stop();
  });



});
app.post('/anticlockwise', function(req,res){
    //Need to ensure that terrain is suitable, not yet done
    client.counterClockwise(SPEED_SPIN);
    client.after(TIME_90_DEGREES, function(){
    this.stop();
  });



});

/*app.post('/sensor', function(req, res){
  side = req.query.side;
  distance[side] = req.query.d;

});*/

function navigate(diffRight, diffDown, callback){
    //Need algorithm to navigate, and ensure that multiple commands don't cause random motion
    if(!isAirborne){
        console.log("Need to takeoff first");
        return;
    }
    //Incomplete
    /*while(!isObstacle("front")){
        client.front(SPEED_FORWARD);
        client.after(TIME_FORWARD_COORDINATE,function(){
            this.stop();
        });
    }*/
    if(diffRight>0){
        client.right(SPEED_SIDE);
        client.after(TIME_SIDE_COORDINATE*diffRight, function(){
        this.stop();
      });
    }
    else if(diffRight<0){
        client.left(SPEED_SIDE);
        client.after(TIME_SIDE_COORDINATE*diffRight*(-1), function(){
        this.stop();
      });
    }
    if(diffDown>0){
        client.right(SPEED_UP);
        client.after(TIME_UP_COORDINATE*diffDown, function(){
        this.stop();
      });
    }
    else if(diffDown<0){
        client.right(SPEED_UP);
        client.after(TIME_UP_COORDINATE*diffDown*(-1), function(){
        this.stop();
      });
    }
    client.front(SPEED_FORWARD);
    client.after(TIME_FORWARD_COORDINATE,function(){
      this.stop();
    });


    callback();
}

//Return whether it is safe to move in given direction or not
/*function isObstacle(direction, callback){
    if(distance[direction]<THRESHOLD_DISTANCE){
      callback(1);
    }
    else{
      callback(0);
    }
   /*  if(direction=="front"){
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
    }*/
//}

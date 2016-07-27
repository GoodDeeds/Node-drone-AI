var http = require("http"),
    drone = require("dronestream");
var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var arDrone = require('ar-drone');
var client = arDrone.createClient();
var morgan =require('morgan');
var app=express();
var routes =require('./routes');
var path=require('path');
var currentx, currenty, targetx, targety;
const midX=150;//Current x cooordinate of drone
const midY=75;//Current y coordinate
/*const SPEED_FORWARD;
const TIME_90_DEGREES;
const TIME_180_DEGREES;
const TIME_FORWARD_COORDINATE;//Time to go forward one coordinate
const TIME_SIDE_COORDINATE;//Sideways
const TIME_UP_COORDINATE;//Up-down
const SPEED_SIDE;
const SPEED_UP;*/

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
    console.log("Received coordinates x: "+targetx+" y: "+targety);
    if(clickEnabled){
      clickEnabled=0;
      navigate(targetx-currentx, targety-currenty, function(){
        clickEnabled=1;
        console.log("Successfully navigated, click now reenabled");
      });

    }
    else{
      console.log("Click for navigation is disabled");
    }

});

app.post('/takeoff', function(req,res){
    if(clickEnabled){
      clickEnabled=0;
      //Need to ensure that takeoff is possible, not yet done
      clickEnabled=1;
      console.log("Taken off");
      isAirborne=1;
      res.end(JSON.stringify({"clickEnabled": clickEnabled}));
    }
    else{
      console.log("Click for takeoff is disabled");
      res.end(JSON.stringify({"clickEnabled": clickEnabled}));
    }

  });


  app.post('/land', function(req,res){
      //Need to ensure that terrain is suitable, not yet done
      if(clickEnabled){
        clickEnabled=0;
        clickEnabled=1;
        console.log("Landed");
        isAirborne=0;
        res.end(JSON.stringify({"clickEnabled": clickEnabled}));
      }
      else{
        console.log("Click for landing is disabled");
        res.end(JSON.stringify({"clickEnabled": clickEnabled}));
      }




});

function navigate(diffRight, diffDown, callback){
    //Need algorithm to navigate, and ensure that multiple commands don't cause random motion
    console.log("In navigate function()");
    callback();
}

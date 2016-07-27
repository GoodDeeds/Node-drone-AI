var async=require('async');
var i=1;
async.forever(
  function(next){
    console.log(i);
    i++;
    if(i<10)
      next();
    else {
      next(1);
    }
  },
  function(err){
    console.log("Done");
  }
);

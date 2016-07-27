
/*var canvas=document.getElementById("grid");
console.log(canvas);*/
function getCursorPosition(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    x=Math.floor(x);
    y=Math.floor(y);
    console.log("x: " + x + " y: " + y);
    $.post("newcommand/?x="+x+"&y="+y);
}
$(document).ready(()=>{
    $("#dronestream").click(function(e){
        getCursorPosition(this, event);
    });
    $("#takeoff").click(function(){
        $.post("takeoff/", function(data){
          if(data==1){
            $(this).prop('disabled', true);
            $("#land").prop('disabled', false);
          }
        });
    });
    $("#land").click(function(){
        $.post("land/", function(data){
          if(data==1){
            $(this).prop('disabled', true);
            $("#takeoff").prop('disabled', false);
          }          
        });
    });
});

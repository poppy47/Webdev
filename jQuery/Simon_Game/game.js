var gamePattern = []; 
var randomChosenColor; 
function nextSequence(){
    var buttonColours = ["red", "blue", "green", "yellow"]; 
    var randomNumber = Math.floor(Math.random()*4);
    randomChosenColor = buttonColours[randomNumber];
    gamePattern.push(randomChosenColor)
    $("#"+randomChosenColor).fadeIn(100).fadeOut(100).fadeIn(100); 

    playSound(randomChosenColor);

}

function playSound(color){
    var audio = new Audio("./sounds/"+color+".mp3");
    audio.play(); 
}
nextSequence();


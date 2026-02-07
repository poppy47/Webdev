$("h1").addClass("big-title margin-50")// adding the class to the object from the css file 
// $("h1").removeClass("big-title")//removing the class 
// $("h1").css("color", "green")// adding the color to the heading 

// $("h1").text("Bye")
// $("button").text("Don't click me")
// $("button").html("<em>Hey</em>")

// console.log($("img").attr("src")) 
// $("a").attr("href", "https://www.yahoo.com"); 

// $("h1").click(function(){
//     $("h1").css("color", "purple")
// })

// for (var i = 0 ; i < 6 ; i++){
//     document.querySelectorAll("button")[i].addEventListener("click", function(){
//         document.querySelector("h1").style.color = "purple"; 
//     })
// }

// $("button").click(function(){
//     $("h1").css("color", "purple"); 
// })

// $("body").keydown(function(event){
//     $("h1").text(event.key);
// })

// $("h1").on("mouseover", function(){
//     $("h1").css("color", "blue");
// })

// $("h1").on("mouseout", function(){
//     $("h1").css("color", "black");
// })

// $("h1").before("<button>Anyone</button>");
// $("h1").after("<button>Anyone</button>");
// $("h1").prepend("<button>Anyone</button>");
// $("h1").append("<button>Anyone</button>"); 
//$("button").remove(); remove all the buttons from the wabpage 

// before , after , prepend , append, remove 
$("button").on("click", function(){
    // $("h1").hide(); 
    //$("h1").show() // for showing the object 
    // $("h1").toggle(); //for hiding and showing the heading simulteniously. 
    //$("h1").fadeOut(); //fading out the element 
    //$("h1").fadeIn(); 
    //$("h1").fadeToggle(); 
    // $("h1").slideUp() ; 
    // $("h1").slideDown(); 
    //$("h1").slideToggle(); 
    //$("h1").animate({opacity:0.5}); // only add the numeric value 
    //Doing the multiple things at the same time 
    $("h1").slideUp().slideDown().animate({opacity:0.5});
})



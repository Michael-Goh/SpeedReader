$(function(){
    //declare variables
    var wordArray;
    var inputLength;
    var reading = false;
    var counter;
    var action;
    var frequency = 200;
    var actualspeed;
    
    
    //on page load hide elements we don't need leave only text area and start button
    $("#new").hide();
    $("#resume").hide();
    $("#pause").hide();
    $("#controls").hide();
    $("#result").hide();
    $("#error").hide();
    
    //click on Start Reading
    $("#start").click(function(){
       //get text and split it to words inside an array
//        \s will match spaces tabs, new lines, etc and + means one or more
        wordArray = $("#userInput").val().split(/\s+/);
        
        //get the number of words
        inputLength = wordArray.length;
    
        if(inputLength>1){//enough input
            reading = true;
            
            //hide Start, error, userinput
            $("#error").hide();
            $("#start").hide();
            $("#userInput").hide();
            
            //show new, pause, controls, reading box
            $("#new").show();
            $("#pause").show();
            $("#controls").show();
            
            //set progress slider maximum value
            $("#progressslider").attr("max", inputLength-1);
            
            //initialise counter
            counter = 0;
            
            // show reading box with the first word
            $("#result").show();
            $("#result").text(wordArray[counter]);
            
            //start reading, from the first word
            action = setInterval(read, frequency);
            
        } else {
            $("#error").show();
        }
        
        
        
    });
    
    //Click on New
    $("#new").click(function(){
        location.reload(); 
    });
    
    //Click on Pause
    $("#pause").click(function(){
        //stop reading and switch to non reading mode
        clearInterval(action);
        reading = false;
        
        //hide pause, show resume
        $("#pause").hide();
        $("#resume").show();
    });
    
    //Click on Resume
    $("#resume").click(function(){
        //startreading and switch to reading mode
        action = setInterval(read, frequency);
        reading = true;
        
        $("#pause").show();
        $("#resume").hide();
    });
    
    //change fontSize
    $("#fontsizeslider").on("slidestop", function(event, ui){
        $(this).slider('refresh');
//        $("#fontsizeslider").slider('refersh');
        
        //get value of the slider
        var slidervalue = parseInt($(this).val());
        $("#result").css("font-size", slidervalue);
        
        $("#fontsize").text(slidervalue);
        
    });
    
    //change speed
    $("#speedslider").on("slidestop", function(event, ui){
        $(this).slider('refresh');

        //get value of the slider
        var slidervalue = parseInt($(this).val());
        $("#speed").text(slidervalue);
        actualspeed = slidervalue;
        
        //stop the reading, change the freq
        clearInterval(action);
        frequency = 60000/slidervalue;
        
        //start reading only if we are in reading mode
        if(reading){
            action = setInterval(read, frequency);
        }
        
    });
    
    
    //progress slider
    $("#progressslider").on("slidestop", function(event, ui){
        $(this).slider('refresh');

        //get value of the slider
        var slidervalue = parseInt($(this).val());
        
        //stop the reading, change the counter, update percentage, and display in results
        clearInterval(action);
        counter = slidervalue;
        $("#percentage").text(Math.floor(100*counter/(inputLength-1)));
        $("#result").text(wordArray[counter]);
        
        //start reading only if we are in reading mode
        if(reading){
            action = setInterval(read, frequency);
        }
        
    });
    //functions
    
    function read(){ //if last word
        if(counter >= inputLength-1){
            clearInterval(action);
            reading = false;
            $("#pause").hide();
        } else {
            //increase counter to next word and show
            counter++;
            $("#result").text(wordArray[counter]);
            //do audio from speakclient.js
            speak(wordArray[counter], { amplitude: 100, wordgap: 0, pitch: 50, speed: actualspeed*1.5 });
            
            //update progress slider and refresh (required for jQueryMobile)
            $("#progressslider").val(counter);
            $("#progressslider").slider('refresh');
            $("#percentage").text(Math.floor(100*counter/(inputLength-1)));

        }
    }
});
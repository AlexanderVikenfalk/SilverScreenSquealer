$(document).ready(function(){
 
 $(window).on("load resize", function () {
                $(".fill-screen").css("height", window.innerHeight);
            });

   $('#term').focus(function(){
      var full = $("#poster").has("img").length ? true : false;
      if(full == false){
         $('#poster').empty();
      }
   });

   var getPoster = function(){
       var base_url = "https://image.tmdb.org/t/p/w342/";  
        var film = $('#term').val();


         if(film == ''){

            $('#poster').html("<h2 class='loading'>Ha! We haven't forgotten to validate the form! Please enter something.</h2>");

         } else {

            $('#poster').html("<h2 class='loading'>Your poster is on its way!</h2>");

            // Sending a get request with the given movie to the API 
            $.getJSON("https://api.themoviedb.org/3/search/movie?api_key=f6ab596ab59d550625734987a1ea07fb&query=" + film, function(json) {
               if (json != "Nothing found."){
                    //Getting poster
                     $('#poster').html('<h2 class="loading"><img id="thePoster" src=' +base_url+json.results[0].poster_path  + ' />');
                    // Getting title
                     $('#title').html('<div id="theTitle"><h2>' +json.results[0].title  +  '</h2></div>');
                     
                     
                     
                  } else {
                     $.getJSON("http://api.themoviedb.org/2.1/Movie.search/en/json/23afca60ebf72f8d88cdcae2c4f31866/goonies?callback=?", function(json) {
                        console.log(json);
                        $('#poster').html('<h2 class="loading">Were afraid nothing was found for that search. Perhaps you were looking for The Goonies?</h2><img id="thePoster" src=' + +base_url+json.results[0].poster_path  + ' />');
                     });
                  }
             });

          }

        return false;
   }

   $('#search').click(getPoster);
   $('#term').keyup(function(event){
       if(event.keyCode == 13){
           getPoster();
       }
   });

});

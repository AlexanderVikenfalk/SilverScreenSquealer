// Todo: 

$main = $("body");

$(document).on({
    ajaxStart: function(ajaxSearch) { $main.addClass("loadingSymbol"); },
    ajaxStop: function(ajaxStop) { $main.removeClass("loadingSymbol"); }
});



$(document).ready(function() {
    var imagesize = "w342/"
    var poster_base_url = "https://image.tmdb.org/t/p/";

    var api_key = "f6ab596ab59d550625734987a1ea07fb";
    var searchedTitle;
    var searchedMovieID;
    var recommendation;
    var recommendationMovieId;
    var director;
    var recommendationPosterPath;
    var ajaxCall;
    // Adjusts the window size when document is loaded (needed for background to work properly in Edge and Firefox)
    $(function() {
        $(".fill-screen").css("height", window.innerHeight);
    });

    //  Adjusts the background image after windows size when window size is changed
    $(window).on("load resize", function() {
        $(".fill-screen").css("height", window.innerHeight);
    });

    // Method to clear all earlier results from .clear-classes
    var clearAll = function() {
        var full = $(".clean");
        $('.clean').empty();
    }

    // var clearPoster = function() {
    //     var full = $(".cleanPoster");
    //     $('.cleanPoster').empty();
    //     $('.poster').html('<img id="thePoster" class="img-responsive clean" src="img/placeholder.png" />');

    // }

    //Main method for getting poster
    var getPoster = function() {
        var film = $('#term').val();


        // $( "#info" ).empty();
        clearAll();

        if (film == '') {
            $('#recommendation').html("<h2 class='loading'>Please type something :-) </h2>");
            $("#thePoster").attr("src", "img/placeholder.png");
        } else {
            $('#recommendation').html("<h2 class='loading'>We're Looking for your poster!</h2>");
            // Sending a get request with the given movie to the API 
            console.log("");

            $.getJSON("https://api.themoviedb.org/3/search/movie?api_key=" + api_key + "&query=" + film, function(json) {
                console.log(json)
                if (json.results[0] != null) {
                    ajaxCall = "https://api.themoviedb.org/3/search/movie?api_key=" + api_key + "&query=" + film;
                    // Getting title
                    searchedTitle = json.results[0].title;
                    searchedMovieID = json.results[0].id;

                    // Getting recommendations
                    $.ajax({
                        url: "https://www.tastekid.com/api/similar?q=" + searchedTitle + "&jsonp=itemRecs&k=255192-SilverSc-H1IKR4E6",
                        dataType: "jsonp",
                        jsonpCallback: "jsonCallback",
                        data: {
                            q: "Name",
                            format: "json"
                        },

                        // Inserting recommendation into text
                        success: function(response) {
                                if (response.Similar.Results[0] != null) {
                                    recommendation = response.Similar.Results[0].Name;

                                    $('#recommendation').html('<div id="title"><h2>If you like: ' + searchedTitle + ' then you\'ll probably also enjoy: ' + recommendation + '</h2></div>');
                                    console.log(ajaxCall);
                                    makeAJAXcall();



                                } else {
                                    console.log("Couldn't find recommendation");
                                    //Poster for recommendation not found
                                    $.getJSON("https://api.themoviedb.org/3/search/movie?api_key=" + api_key + "&query=themask", function(json) {
                                        console.log("Line 96");
                                        // clearAll();
                                        $('#recommendation').html('<h2 class="loading">Sorry, but we couldnt find any recommendation for ' + searchedTitle + '</h2>');
                                        $("#thePoster").attr("src", "img/placeholder.png");
                                    });
                                }
                            } // Stop
                    });


                    // Couldn't find recommendation at all    
                } else {
                    $.getJSON("https://api.themoviedb.org/3/search/movie?api_key=" + api_key + "&query=goonies", function(json) {
                        console.log("Line 105");
                        $('#recommendation').html('<h2>Sorry, but we couldnt find ' + film + ' but maybe this poster will do instead?</h2>');
                        $("#thePoster").attr("src", "" + poster_base_url + imagesize + json.results[0].poster_path + "");


                    });
                }
            });

        }

        return false;
    }


    $('#search').click(getPoster);
    $('#term').keyup(function(event) {
        if (event.keyCode == 13) {
            getPoster();
        }
    });
    // ajaxCall2 = $.getJSON("https://api.themoviedb.org/3/search/movie?api_key=" + api_key + "&query=" + recommendation);
    // Getting poster and movie id for recommendation
    var makeAJAXcall = function() {
        $.when($.getJSON(ajaxCall), $.getJSON("https://api.themoviedb.org/3/search/movie?api_key=" + api_key + "&query=" + recommendation)).done(function(result1, result2) {

            if (result2 != null) {
                console.log(result2[0].results[0].id);
                // console.log(result2[0].object.results[0].object.id);
                recommendationMovieId = result2[0].results[0].id;
                console.log("reco ID" + recommendationMovieId);
                recommendationPosterPath = result2[0].results[0].poster_path;
                // console.log("Reco poster path" + recommendationPosterPath);
                // console.log(json.results[0].original_title)
                if (result2[0].results[0].poster_path != null) {
                    // $("#thePoster").attr('src','img url');
                    $("#thePoster").attr("src", "" + poster_base_url + imagesize + recommendationPosterPath + "");
                    // $('.poster').html('<h3 class="loading"><img id="thePoster" class="img-responsive" src=' + poster_base_url + imagesize + json.results[0].poster_path + ' /></h3>');

                } else {
                    $('#recommendation').html('<h2 class="loading">Sorry, no poster found poster for ' + recommendation + '</h2>');
                }
                // Getting info for recommendation
                $.getJSON("https://api.themoviedb.org/3/movie/" + recommendationMovieId + "?api_key=" + api_key + "", function(json) {
                    $('#plot').html('<h4 id="resultPlot">' + json.overview + '</h4>');
                    $('#releaseYear').html('<h4 id="resultYear">' + json.release_date + '</h4>');
                    $('#runtime').html('<h4 id="resultRuntime">' + json.runtime + '</h4>');
                    // $('#genre').html('<h4 id="resultGenre">' + json.GENRE + '</h4>');
                });

                // Getting cast for recommendation
                $.getJSON("https://api.themoviedb.org/3/movie/" + recommendationMovieId + "/casts?api_key=" + api_key + "", function(json) {
                    if (json.cast[0] != null) {
                        $('#director').html('<h4 id ="resultDirector">' + json.crew[0].name + '</h4>');
                    } else {
                        $('#director').html('<h4 id="resultDirector"">No director found for: ' + recommendation + '</h4>');
                    }
                });
            } else {
                //Poster for recommendation not found
                console.log("Line 85");
                $('#recommendation').html('<h2 class="loading">Sorry, but we couldn\'t find' + recommendation + ' </h2>');
            }
        });
    }
});




//  });
// Coded by Alexander Vikenfalk
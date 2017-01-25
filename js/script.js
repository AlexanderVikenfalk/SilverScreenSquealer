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

    //Main method for getting poster
    var getPoster = function() {
        var film = $('#term').val();

        clearAll();

        if (film == '') {
            $('#message').html("It seems like you forgot to type something. ");
            $("#thePoster").attr("src", "img/placeholder.png");
        } else {
            $('#message').html("We're Looking for your recommendation!");
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

                                $('#message').html('If you liked <b>' + searchedTitle + '</b> then you might also enjoy <b>' + recommendation + '</b>');
                                console.log(ajaxCall);
                                makeAJAXcall();

                            } else {
                                console.log("Couldn't find recommendation");
                                //Poster for recommendation not found


                                $('#message').html('Sorry, but we couldnt find any recommendation for ' + searchedTitle + '');
                                $("#thePoster").attr("src", "img/placeholder.png");

                            }
                        }
                    });


                    // Couldn't find recommendation at all    
                } else {


                    $('#message').html('Sorry, we couldn\'t find ' + film + ' but maybe a picture of a man holding a cat will do instead?');
                    $("#thePoster").attr("src", './img/notFound.jpeg');



                    // });
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

    // Getting poster and movie id for recommendation
    var makeAJAXcall = function() {
        $.when($.getJSON(ajaxCall), $.getJSON("https://api.themoviedb.org/3/search/movie?api_key=" + api_key + "&query=" + recommendation)).done(function(result1, result2) {

            if (result2 != null) {


                recommendationMovieId = result2[0].results[0].id;

                recommendationPosterPath = result2[0].results[0].poster_path;

                if (result2[0].results[0].poster_path != null) {

                    $("#thePoster").attr("src", "" + poster_base_url + imagesize + recommendationPosterPath + "");


                } else {
                    $('#message').html('Sorry, no poster found poster for ' + recommendation + '');
                }
                // Getting info for recommendation
                $.getJSON("https://api.themoviedb.org/3/movie/" + recommendationMovieId + "?api_key=" + api_key + "", function(json) {

                    // Inserting Plot                   
                    $('#plot').html('<div class="col-xs-4 col-sm-3"><b>Overview</b></div><div class="col-xs-8 col-sm-9">' + json.overview + '</div>');

                    // Cropping the release date to only show the year.
                    var releaseYear = json.release_date.substring(0, 4);

                    // Inserting releaseYear and adding a <br> for the next result to not end up on the wrong line
                    $('#releaseYear').html('<div class="col-xs-4 col-sm-3"><b>Release Year</b></div><div class="col-xs-8 col-sm-9">' + releaseYear + '</div>');

                    // Converting runtime from minutes to hours and minutes.
                    var hours = Math.floor(json.runtime / 60);
                    var minutes = json.runtime % 60;

                    // Inserting converted runtime
                    $('#runtime').html('<div class="col-xs-4 col-sm-3"><b>Runtime</b></div><div class="col-xs-8 col-sm-9">' + hours + " h " + minutes + ' m</div>');

                    // Itterating over all genre in the object and saving them in one string 
                    var genres
                    $.each(json.genres, function(i, item) {
                        genres += item.name + ", ";
                    });
                    // The first genre was always "undefined" so i cropped that out. A sloppy hack - sorry.
                    var genresCropped = genres.substring(9);
                    // Removing last comma in string
                    var genresCropped = genresCropped.slice(0, -2);

                    $('#genre').html('<div class="col-xs-4 col-sm-3"><b>Genre</b></div><div class="col-xs-8 col-sm-9">' + genresCropped + '');
                });


                // Getting cast for recommendation
                $.getJSON("https://api.themoviedb.org/3/movie/" + recommendationMovieId + "/casts?api_key=" + api_key + "", function(json) {
                    if (json.cast[0] != null) {
                        $('#director').html('<div class="col-xs-4 col-sm-3"><b> Director </b> </div><div class="col-xs-8 col-sm-9">' + json.crew[0].name + '</b> </div>');
                    } else {
                        $('#director').html('<div class="col-xs-4 col-sm-3"><b> Director </b></div><div class="col-xs-8 col-sm-9">no direcctor found for ' + recommendation + '</div>');
                    }
                });
            } else {
                //Poster for recommendation not found
                console.log("Line 85");
                $('#message').html('Sorry, but we couldn\'t find' + recommendation + ' ');
            }
        });
    }
});




//  });
// Coded by Alexander Vikenfalk
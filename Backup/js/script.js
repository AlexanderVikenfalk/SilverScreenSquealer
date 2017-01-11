// Todo: 


$(document).ready(function () {

    // Adjusts the window size when document is loaded (needed for background to work properly in Edge and Firefox)
    $(function () {
        $(".fill-screen").css("height", window.innerHeight);
    });


    //  Adjusts the background image after windows size when window size is changed
    $(window).on("load resize", function () {
        $(".fill-screen").css("height", window.innerHeight);
    });


    //Checks if div for poster already contains and image and removes it if it does.
    // $('#term').focus(function () {
    //     var full = $("#poster").has("img").length ? true : false;
    //     if (full == false) {
    //         $('#poster').empty();
    //     }
    // });

    // Method to clear all earlier results
    var clearAll = function () {
        var full = $("#recommendation").has("<h2>").length ? true : false;
        if (full == false) {
            $('#recommendation').empty();
        }

        var full = $("#poster").has("img").length ? true : false;
        if (full == true) {
            $('#poster').empty();
        }
    }

    //Main method for getting poster
    var getPoster = function () {
        var base_url = "https://image.tmdb.org/t/p/w342/";
        var film = $('#term').val();
        var recommendation;
        var currentTitle;
        var movieID;

        clearAll();

        if (film == '') {
            $('#poster').html("<h2 class='loading'>Ha! We haven't forgotten to validate the form! Please enter something.</h2>");
        } else {
            $('#recommendation').html("<h2 class='loading'>We're Looking for your poster!</h2>");
            // Sending a get request with the given movie to the API 
            $.getJSON("https://api.themoviedb.org/3/search/movie?api_key=f6ab596ab59d550625734987a1ea07fb&query=" + film, function (json) {
                if (json.results[0] != null) {
                    // Getting title
                    currentTitle = json.results[0].title;
                    movieID = json.results[0].id;

                    // Getting recommendations
                    $.ajax({
                        url: "https://www.tastekid.com/api/similar?q=" + currentTitle + "&jsonp=itemRecs&k=255192-SilverSc-H1IKR4E6",
                        dataType: "jsonp",
                        jsonpCallback: "jsonCallback",
                        data: {
                            q: "Name",
                            format: "json"
                        },

                        // Inserting recommendation into text
                        success: function (response) {
                            if (response.Similar.Results[0] != null) {
                                recommendation = response.Similar.Results[0].Name;

                                $('#recommendation').html('<div id="title"><h2>If you like: ' + currentTitle + ' then you\'ll probably also enjoy: ' + recommendation + '</h2></div>');

                                // Getting poster for recommendation
                                $.getJSON("https://api.themoviedb.org/3/search/movie?api_key=f6ab596ab59d550625734987a1ea07fb&query=" + recommendation, function (json) {
                                    if (json.results[0] != null) {
                                        console.log("Line 78");
                                        $('#poster').html('<h2 class="loading"><img id="thePoster" src=' + base_url + json.results[0].poster_path + ' /></h2>');

                                    } else {
                                        //Poster for recommendation not found
                                        $.getJSON("https://api.themoviedb.org/3/search/movie?api_key=f6ab596ab59d550625734987a1ea07fb&query=snatch", function (json) {
                                            console.log("Line 85");
                                            $('#recommendation').html('<h2 class="loading">Sorry, but we couldnt find any poster for' + recommendation + ' </h2>');
                                        });
                                    }
                                });
                                    movieID = 343611;
                                 // Getting extended info regarding movie
                                $.getJSON("https://api.themoviedb.org/3/movie/"+movieID+"?api_key=f6ab596ab59d550625734987a1ea07fb", function (json) {
                                       
                                        console.log(json.overview);
                                        $('#info').html('<h2 class="loading">Plot:' + json.overview + '</h2>');                              
                                });                           
                            }
                            else {
                                console.log("Couldn't find recommendation");
                                //Poster for recommendation not found
                                $.getJSON("https://api.themoviedb.org/3/search/movie?api_key=f6ab596ab59d550625734987a1ea07fb&query=themask", function (json) {
                                    console.log("Line 95");
                                    clearAll();
                                    $('#recommendation').html('<h2 class="loading">Sorry, but we couldnt find any recommendation for ' + currentTitle + '</h2>');
                                });
                            }
                        }
                    });


                    // Couldn't find recommendation at all    
                } else {
                    $.getJSON("https://api.themoviedb.org/3/search/movie?api_key=f6ab596ab59d550625734987a1ea07fb&query=goonies", function (json) {
                        console.log("Line 105");
                        $('#recommendation').html('<h2>Sorry, but we couldnt find ' + film + ' but maybe this poster will do instead?</h2><img id="thePoster" src=' + base_url + json.results[0].poster_path + ' />');
                    });
                }
            });

        }

        return false;
    }


    $('#search').click(getPoster);
    $('#term').keyup(function (event) {
        if (event.keyCode == 13) {
            getPoster();
        }
    });
});
// Coded by Alexander Vikenfalk

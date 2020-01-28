// setup variables
// ==================
var authKey = "XsHooD7P3BGSG9xEyZyvk7KD5p6LuGYF";

var searchTerm = "";
var numRecords = 0;
var startYear = 0;
var endYear = 0;

// url of api authorization
var queryURLBase = "https://api.nytimes.com/svc/search/v2/articlesearch.json?&api-key=" + authKey;


// variable to track number of articles
var articleCounter = 0;

// functions
// ==================

function runQuery(numArticles, queryURL) {
console.log(queryURL)
    $.ajax({ url: queryURL, method: "GET" })
        .done(function(NYTData) {


            // for loop to go thru the numArticles and send to the console.log

            // clear the wells frp, the previous run
            $('#wellSection').empty();

            for (var i = 0; i < numArticles; i++) {
                
                // starting to send to HTML here
                var wellSection = $('<div>');
                wellSection.addClass("well");
                wellSection.attr('id', 'articleWell-' + i);
                // grab the well section and append to it
                $('#wellSection').append(wellSection);

                // checks if things exist
                if (NYTData.response.docs[i].headline != "null") {
                    console.log(NYTData.response.docs[i].headline.main);
                    $("#articleWell-" + i).append("<h3>" + NYTData.response.docs[i].headline.main + "</h3>");
                }

                // checks if the byline exist
                if (NYTData.response.docs[i].byline && NYTData.response.docs[i].byline.hasOwnProperty("original")) {
                    console.log(NYTData.response.docs[i].byline.original);
                    $("#articleWell-" + i).append("<h5>" + NYTData.response.docs[i].byline.original + "</h5>");
                }


                // attached the content to the appropriate well, adds a target of blank to open URLs in new window

                $('a[href^="http://"], a[href^="https://"]').attr('target', '_blank');
                $("#articleWell-" + i).append("<h5>" + NYTData.response.docs[i].section_name + "</h5>");
                $("#articleWell-" + i).append("<h5>" + NYTData.response.docs[i].pub_date + "</h5>");
                $("#articleWell-" + i).append("<a href=" + NYTData.response.docs[i].web_url + ">" + NYTData.response.docs[i].web_url + "</a>");

            }

        }).fail(function(err) {
            throw err;
        });

}

// main processes
// ==================


// on click this pulls the query from the api 

$('#searchBtn').on('click', function() {

    searchTerm = $('#search').val().trim();
    // console.log(searchTerm);

    var newURL = queryURLBase + "&q=" + searchTerm;
    // console.log(newURL);

    // get the number of results		
    numRecords = $('#numRecords').val();


    // get the start and end year
    startYear = $('#startYear').val().trim();
    endYear = $('#endYear').val().trim();


    if (parseInt('startYear')) {

        // add the needed field to the url
        startYear = startYear + +"0101";

        // add the date information to the url
        newURL = newURL + "&begin_date=" + startYear;
    }

    if (parseInt('endYear')) {

        // add the needed field to the url
        endYear = endYear + +"0101";

        // add the date information to the url
        newURL = newURL + "&end_date=" + endYear;
    }


    // var newURL = newURL + "&begin_date=" + startYear + "&end_date=" + endYear;
    // console.log(newURL);


    runQuery(numRecords, newURL);
    return false;

})

$(".reset").click(function() {
    $(this).closest('form').find("input[type=text], textarea").val("");
});


// Psuedocoding
// ==================
// 1 - retrieves user inputs and convert to variables
// 2 - use those variables to run an ajax call to the New York Times
// 3 - breakdown the NYT object into usrable fields
// 4 - dynamically generate the html content
// 5 - deal with 'edge cases' -- bugs or situations that are not intuitive.
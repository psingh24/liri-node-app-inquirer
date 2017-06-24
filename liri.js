var Twit = require("twit");
var Twitter = require('twitter');
var config = require("./keys")
var Spotify = require('node-spotify-api');
var request = require("request")
var fs = require("fs")
var inquirer = require("inquirer")

//Twit for general search
var T = new Twit(config.twitKeys);
//search your tweets
var TT = new Twitter(config.twitKeys)
//Spotify
var S = new Spotify(config.spotifyKeys)
var twitterSearch = "";
//Greeting
    console.log("****************     Welcome to Liri!     ***********************")
    console.log("*****     LIRI is like iPhone's SIRI. However, while        *****")
    console.log("*****     SIRI is a Speech Interpretation and               *****")
    console.log("*****     Recognition Interface, LIRI is a Language         *****")
    console.log("*****     Interpretation and Recognition Interface.         *****")
    console.log("*****     LIRI is a command line node app that takes        *****")
    console.log("*****     in parameters and gives you back data.            *****")
    console.log("*****************************************************************")
    console.log("***********        Start Searching Below        *****************")
    console.log("")
    console.log("")
    console.log("")
    
function liri() {
  
    inquirer.prompt([
        
        {
            name: "route",
            message: "What would you like to do?",
            type: "list",
            choices: ["Spotify a Song", "Search for a Movie", "Search Twitter", "Display my Tweets", "Do what it says"]
        },
        {
            name: "myTwitter",
            message: "Are you sure you want to search my secret Twitter?",
            type: "confirm",
            when: function(answers) {
                return answers.route === "Display my Tweets"
            }
        },
        {
            name: "spotify",
            message: "What song would you like to search for?",
            when: function(answers) {
                return answers.route === "Spotify a Song"
            }
        },
        {
            name: "movie",
            message: "What movie would you like to search for?",
            when: function(answers) {
                return answers.route ===  "Search for a Movie"
            }
        },
        {
            name: "twitter",
            message: "What would you like to search for?",
            when: function(answers) {
                return answers.route === "Search Twitter"
            }
        },

    ]).then(function(answers){

            if (answers.twitter) {
                // console.log(answers.spotify)
                twitterSearch = answers.twitter;
                T.get('search/tweets', { q: answers.twitter, count: 5 }, getTwitterData)
                setTimeout(searchAgain, 2000)
            } 
            else if(answers.myTwitter){
                TT.get('statuses/user_timeline', {screen_name: 'pstesttwit'}, getYourTwitter)
                setTimeout(searchAgain, 2000)
            }
            else if(answers.spotify){

                S.search({type: 'track', query: answers.spotify}, getSpotifyData)
                setTimeout(searchAgain, 2000)
            }
            // else if(!answers.movie) {
            //     request("http://www.omdbapi.com/?t=Mr.Nobody&y=&plot=short&apikey=40e9cece", getMovieData);
            //     setTimeout(searchAgain, 2000)  
            // }
            // else if(!answers.spotify) {

            //     S.search({type: 'track', query: "The Sign"}, function(err, data) {
            //         if (err) {
            //             return console.log('Error occurred: ' + err);
            //     }
            //             var artist = data.tracks.items[4].artists[0].name;
            //             var songName = data.tracks.items[4].name;
            //             var preview = data.tracks.items[4].preview_url;
            //             var album = data.tracks.items[4].album.name;

            //             console.log("")
            //             console.log("Artist: "+artist)
            //             console.log("Album: "+album)
            //             console.log("Song Name: "+songName)
            //             console.log("Preview Url: "+preview)

            //             var output = "\nSpotify Search: "+songName+", "+artist+"\n======================" 

            //             writeToLogTxt(output)
                
            //         })
            //     setTimeout(searchAgain, 2000)
            // }
            else if (answers.movie) {
                request("http://www.omdbapi.com/?t="+answers.movie+"&y=&plot=short&apikey=40e9cece", getMovieData);
                setTimeout(searchAgain, 2000)
            }
            else if(answers.route) {
                doWhatItSays()
                setTimeout(searchAgain, 2000)
            }

    })
}

liri()

function searchAgain() {
    inquirer.prompt([
        {
            name: "searchAgain",
            message: "Would you like to search again?",
            type: "confirm"
        }
    ]).then(function(answers) {
        if (answers.searchAgain) {
            liri()
        } else {
            console.log("Thank you come back soon!")
        }
    })
}

function getTwitterData(err, data, response) {
    var tweets = data.statuses
    // console.log(tweets)
    for (var i=0; i < tweets.length; i++) {
        var dateTweeted = tweets[i].created_at;
        var tweet = tweets[i].text;
        var personWhoTweeted = tweets[i].user.name;
        console.log(dateTweeted)
        console.log("")
        console.log(tweet)
        console.log("- "+personWhoTweeted)
        console.log("=============================================================")
    }

        var output = "\nTwitter Search: "+twitterSearch+"\n======================" 
        writeToLogTxt(output)
}

function getYourTwitter(error, tweets, response) {
    if (!error) {
        var dataArray = tweets
        for (var i=0; i < dataArray.length; i++) {
            var dateTweeted = tweets[i].created_at;
            var tweet = tweets[i].text;
            var personWhoTweeted = tweets[i].user.name;
            console.log(dateTweeted)
            console.log("")
            console.log(tweet)
            console.log("- "+personWhoTweeted)
            console.log("=============================================================")
        }
        var output = "\nTwitter Search: "+personWhoTweeted+" Tweets"+"\n======================" 
        writeToLogTxt(output)
    }
}
function getSpotifyData(err, data) {
    if (err) {
        return console.log('Error occurred: ' + err);
    }
 
    var artist = data.tracks.items[0].artists[0].name
    var songName = data.tracks.items[0].name
    var preview = data.tracks.items[0].preview_url
    var album = data.tracks.items[0].album.name

    console.log("")
    console.log("Artist: "+artist)
    console.log("Album: "+album)
    console.log("Song Name: "+songName)
    console.log("Preview Url: "+preview)

    var output = "\nSpotify Search: "+songName+", "+artist+"\n======================" 

    writeToLogTxt(output)
}
 
function getMovieData(error, response, body) {
    // If the request is successful (i.e. if the response status code is 200)
    if (!error && response.statusCode === 200) {
        var data = JSON.parse(body)
        var title = data.Title;
        var year = data.Year;
        var imdbRating = data.imdbRating;
        var country = data.Country;
        var language = data.Language;
        var plot = data.Plot;
        var actors = data.Actors;
        var rottenRating = data.Ratings[1].Value;

        console.log("")
        console.log("Title: " + title);
        console.log("Year Released: " + year);
        console.log("IMDB Rating: " + imdbRating);
        console.log("Produced In: " + country);
        console.log("Lanuage(s): " + language);
        console.log("Plot: " + plot);
        console.log("Actors: " + actors);
        console.log("Rotten Tomatoes Rating: " + rottenRating);
        
        var output = "\nMovie Search: "+title+"\n======================" 

        writeToLogTxt(output)
    } 
}
function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(error, data){

	        if(error) {
		        console.log(error)
	        }

            var results = data.slice(18)
            console.log(results)
          
            S.search({ type: 'track', query: results}, function(err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
            }
            var artist = data.tracks.items[0].artists[0].name
            var songName = data.tracks.items[0].name
            var preview = data.tracks.items[0].preview_url
            var album = data.tracks.items[0].album.name

            console.log("")
            console.log("Artist: "+artist)
            console.log("Album: "+album)
            console.log("Song Name: "+songName)
            console.log("Preview Url: "+preview)

            var output = "\nSpotify Search: "+songName+", "+artist+"\n======================"

            fs.appendFile("log.txt", output, function(error){

	            if(error) {
		            console.log(error)
	            }
            })
        })
        
})
}

function writeToLogTxt(output) {
    fs.appendFile("log.txt", output, function(error){

	        if(error) {
		        console.log(error)
	        }
        })
}


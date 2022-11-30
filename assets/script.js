var apiKey = "5d24a209164ebb16740099f76c9581a4";
var current_weather_display = document.getElementById("current_weather");
var city_input = document.getElementById("city_input");
var search_button = document.getElementById("search_button");


search_button.addEventListener("click", function(){
    var city = city_input.value; 
    get_weather(city);
})

//Request current weather from weather API 
function get_weather(city){
    var requestURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=5&appid=" + apiKey;

    $.ajax({
        type: 'GET',
        url: requestURL, 
        dataType: 'json',
        success: function(response) {
            var lat = response[0].lat;
            var lon = response[0].lon;
            var weatherURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=imperial&cnt=6&appid=" + apiKey;
            $.ajax({
                type: 'GET',
                url: weatherURL, 
                dataType: 'json',
                success: function(response) {
                    console.log(response);
                    var current_day = response.list[0].main.temp;
                    var current_wind = response.list[0].wind.speed; 
                    var current_humidity = response.list[0].main.humidity;
                }
            })
        }
    })
}

//Display current weather


//Get 5 day forecast

//Display weather, temperature, wind-speed, and humidity for next 5 days

//Add icon representing weather conditions



//Grab search history from local storage
var apiKey = "5d24a209164ebb16740099f76c9581a4";
var current_weather_display = document.getElementById("current_weather");
var city_input = document.getElementById("city_input");
var search_button = document.getElementById("search_button"); 
var display_search_history = document.getElementById("search_history");

get_search_history();

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
                    localStorage.setItem("saved_city_" + city, city);
                    get_search_history();
                    console.log(response);
                    $("#city_and_date").text(response.city.name);
                    var icon_name = response.list[0].weather[0].icon;
                    var imageURL =  "https://openweathermap.org/img/wn/" + icon_name + ".png";
                    $("#icon").attr("src", imageURL);
                    $("#today_temp").text("Temp: " + response.list[0].main.temp + "°F");
                    $("#today_wind").text("Wind: " + response.list[0].wind.speed + " MPH");
                    $("#today_humidity").text("Humidity: " + response.list[0].main.humidity + " %");
                    for (var i = 1; i <= 5; i++) {
                        var day = $("#day" + i);
                        icon_name = response.list[i].weather[0].icon;
                        imageURL =  "https://openweathermap.org/img/wn/" + icon_name + ".png";
                        day.children(".icon").attr("src", imageURL);
                        day.children(".temp").text("Temp: " + response.list[i].main.temp + "°F");
                        day.children(".wind").text("Wind: " + response.list[i].wind.speed + " MPH");
                        day.children(".humidity").text("Humidity: " + response.list[i].main.humidity + " %");
                    }
                }
            })
        }
    })
}

function get_search_history() {
    while (display_search_history.firstChild){
        display_search_history.removeChild(display_search_history.firstChild);
    }
    
    for (var key in localStorage){
        if (key.startsWith("saved_city_")){
            var history_button = document.createElement("button");
            history_button.id = key;
            var city = key.replace("saved_city_", "");
            history_button.textContent = city;
            display_search_history.appendChild(history_button);
            history_button.addEventListener("click", function(event){
                var city = event.target.id.replace("saved_city_", "");
                get_weather(city);
            })
        }
    }
}


//Display current weather


//Get 5 day forecast

//Display weather, temperature, wind-speed, and humidity for next 5 days

//Add icon representing weather conditions



//Grab search history from local storage
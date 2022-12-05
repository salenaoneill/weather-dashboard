//declaring variables
var apiKey = "5d24a209164ebb16740099f76c9581a4";
var current_weather_display = document.getElementById("current_weather");
var city_input = document.getElementById("city_input");
var search_button = document.getElementById("search_button"); 
var display_search_history = document.getElementById("search_history");

get_search_history();

//listen for the search button to be clicked
search_button.addEventListener("click", function(){
    var city = city_input.value; 
    get_weather(city);
})

//formats epoch time into a formatted string
function format_time_stamp(timestamp){
    var date = new Date(timestamp * 1000); 
    var day_of_month = date.getUTCDate();
    var month = date.getUTCMonth() + 1;
    var year = date.getUTCFullYear();
    return month + "/" + day_of_month + "/" + year;
}

//grabs needed information from the open weather API
function get_weather(city){
    var requestURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=5&appid=" + apiKey;

    $.ajax({
        type: 'GET',
        url: requestURL, 
        dataType: 'json',
        //finds longitude and latitude of searched city.
        success: function(response) {
            var lat = response[0].lat;
            var lon = response[0].lon;
            var weatherURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + apiKey;
            $.ajax({
                type: 'GET',
                url: weatherURL, 
                dataType: 'json',
                success: function(response) {
                    localStorage.setItem("saved_city_" + city, city);
                    get_search_history();
                    $("#city_and_date").text(response.name + "(" + format_time_stamp(response.dt) + ")");
                    //displays current icon, temperature, wind, and humidity of searched city
                    var icon_name = response.weather[0].icon;
                    var imageURL =  "https://openweathermap.org/img/wn/" + icon_name + ".png";
                    $("#icon").attr("src", imageURL);
                    $("#today_temp").text("Temp: " + response.main.temp + "°F");
                    $("#today_wind").text("Wind: " + response.wind.speed + " MPH");
                    $("#today_humidity").text("Humidity: " + response.main.humidity + " %");






                    //displays 5-day forecast icons, temperatures, wind, and humidities of searched city.
                    weatherURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=imperial&cnt=40&appid=" + apiKey;
                    $.ajax({
                        type: 'GET',
                        url: weatherURL, 
                        dataType: 'json',
                        success: function(response) {
                            var day_index = 1;
                            for (var i = 1; i <= 39; i+=8) {
                                var day = $("#day" + day_index);
                                icon_name = response.list[i].weather[0].icon;
                                imageURL =  "https://openweathermap.org/img/wn/" + icon_name + ".png";
                                day.children(".date").text(format_time_stamp(response.list[i].dt));
                                day.children(".icon").attr("src", imageURL);
                                day.children(".temp").text("Temp: " + response.list[i].main.temp + "°F");
                                day.children(".wind").text("Wind: " + response.list[i].wind.speed + " MPH");
                                day.children(".humidity").text("Humidity: " + response.list[i].main.humidity + " %");
                                day_index +=1;
                            }
                        }
                    });




                }
            })
        }
    })
}



function get_search_history() {
    //clear history before adding items to search history
    while (display_search_history.firstChild){
        display_search_history.removeChild(display_search_history.firstChild);
    }
    //displays search history
    for (var key in localStorage){
        if (key.startsWith("saved_city_")){
            var history_button = document.createElement("button");
            history_button.id = key;
            var city = key.replace("saved_city_", "");
            history_button.textContent = city;
            display_search_history.appendChild(history_button);
            //if an item in the search history is clicked, display information regarding that city.
            history_button.addEventListener("click", function(event){
                var city = event.target.id.replace("saved_city_", "");
                get_weather(city);
            })
        }
    }
}

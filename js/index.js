//api key from wunderground: 77030e192533f63d
//example api for geolocation: https://api.wunderground.com/api/API_KEY/conditions/forecast/alert/q/37.252194,-121.360474.json
var apiKey = "77030e192533f63d";
var long;
var lat;
var fTemp;
var cTemp;
var api;
var kelvin;
var windSpeed;
var city;
var state;
var weatherType;
var image_url;
var apiError = "ERROR on API!!!";

//define function to get the local weather, run below in doc ready function
function getWeather() { 
  //get object from wunderground
  $.ajax({
    dataType: "json",
    url: api,
    //data: {},
    success: function(data) {
      console.log(data);
      city = data.current_observation.display_location.city;
      state = data.current_observation.display_location.state_name;
      $("#city").html(city + ", " + state);
      console.log("City you are currently in: " + city + ", " + state);
      weatherType = data.current_observation.weather;
      $("#weatherType").html(weatherType);
      fTemp = data.current_observation.temp_f;
      fTemp = fTemp.toFixed(0);
      $("#temp").html(fTemp + "°F");
      
      //switch between Fahrenheit and Celsius
      $("#button").click(function() {
        if (document.getElementById("temp") !== null) {
          $("#temp").html(cTemp + "°C");
          //document.getElementById("temp").id = 'cTemp';
          $('#temp').attr('id','cTemp');
          //document.getElementById("button").innerHTML = "Switch to Fahrenheit";
          $('#button').html('Switch to Fahrenheit');
        } else {
          $("#cTemp").html(fTemp + "°F");
          //document.getElementById("cTemp").id = 'temp';
          $('#cTemp').attr('id','temp');
          //document.getElementById("button").innerHTML = "Switch to Celsius"
          $('#button').html('Switch to Celsius');
        }
      });

      cTemp = data.current_observation.temp_c;
      cTemp = cTemp.toFixed(0);
      //$('#cTemp').html(cTemp + "°C")
      windSpeed = data.current_observation.wind_string;
      $("#windSpeed").html(windSpeed);
      image_url = data.current_observation.icon_url;
      document.getElementById("image").src = image_url;
    },
    error: function(data) {
      $("#error").text(data);
      console.log(data);
    }
  });
}

$(document).ready(function() {
  //get location using ipapi
  $.getJSON('https://ipapi.co/json/', function(geodata) {
    lat = geodata.latitude;
    long = geodata.longitude;

    //$("#gpsCoord").html("latitude: " + lat + "<br>longitude: " + long);
    console.log("Your position is: " + long + "  " + lat);

    //wunderground api below
    api = "https://api.wunderground.com/api/" + apiKey + "/conditions/forecast/alert/q/" + lat + "," + long + ".json";
    console.log(api);
    //$("#apiHere").html("API is: " + api);

    //run function above
    getWeather();

  });

});
//API from openweathermap.com: ef0a6d0921431f9f189ee67b50a9455a

var apiKey = "ef0a6d0921431f9f189ee67b50a9455a";
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
var cardinalDirection;
var windSpeedString = "";
var mph;
var mps;
var windDirectionDegrees;

function windDirection (degree){
  degree = parseFloat(degree)
  switch (true) {
    case (degree > 348.75): 
    case (degree < 11.25):
      cardinalDirection = "N";
      break;
    case (11.25 < degree && degree < 33.75):
      cardinalDirection = "NNE";
      break;
    case (33.75 < degree && degree < 56.25):
      cardinalDirection = "NE";
      break;
    case (56.25 < degree && degree < 78.75):
      cardinalDirection = "ENE";
      break;
    case (78.75 < degree && degree < 101.25):
      cardinalDirection = "E";
      break;
    case (101.25 < degree && degree < 123.75):
      cardinalDirection = "ESE";
      break;
    case (123.75 < degree && degree < 146.25):
      cardinalDirection = "SE";
      break;
    case (146.25 < degree && degree < 168.75):
      cardinalDirection = "SSE";
      break;
    case (146.25 < degree && degree < 168.75):
      cardinalDirection = "SSE";
      break;
    case (168.75 < degree && degree < 191.25):
      cardinalDirection = "S";
      break;
    case (191.25 < degree && degree < 213.75):
      cardinalDirection = "SSW";
      break;
    case (213.75 < degree && degree < 236.25):
      cardinalDirection = "SW";
      break;
    case (236.25 < degree && degree < 258.75):
      cardinalDirection = "WSW";
      break;
    case (258.75 < degree && degree < 281.25):
      cardinalDirection = "W";
      break;
    case (281.25 < degree && degree < 303.75):
      cardinalDirection = "WNW";
      break;
    case (303.75 < degree && degree < 326.25):
      cardinalDirection = "NW";
      break;
    case (326.25 < degree && degree < 348.75):
      cardinalDirection = "NNW";
      break;
  }
  console.log("degree is:", degree)
  console.log("cardinalDirection is:", cardinalDirection)
  return cardinalDirection;
}

function mphToMps (mph) {
  mps = mph * ( 1609.34 / 1) * ((1 / 60) * (1 / 60))
  return parseFloat(mps).toFixed(2) 
}

function mpsToMph (mps) {
  mph = mps * (1 / 1609.34) * (60 / 1) * (1 / 60);
  return parseFloat(mph).toFixed(2)
}


//define function to get the local weather, run below in doc ready function
function getWeather() { 
  //get object from wunderground
  $.ajax({
    dataType: "json",
    url: api,
    //data: {},
    success: function(data) {
      console.log(data);
      city = data.name;
      $("#city").html(city + ", " + state);
      console.log("City you are currently in: " + city + ", " + state);
      weatherType = data.weather[0]['description'];
      $("#weatherType").html(weatherType);
      fTemp = data.main.temp
      fTemp = fTemp.toFixed(0);
      cTemp = (fTemp - 32) * (5 / 9);
      cTemp = cTemp.toFixed(0);
      $("#temp").html(fTemp + "°F");
      windDirectionDegrees = data.wind.deg;
      mph = data.wind.speed;
      mps = mphToMps(mph);
      
      //switch between Fahrenheit and Celsius
      $("#button").click(function() {
        if (document.getElementById("temp") !== null) {
          $("#temp").html(cTemp + "°C");
          //document.getElementById("temp").id = 'cTemp';
          windSpeedString = `Wind from the ${windDirection(windDirectionDegrees)} at ${mps} MPS`;    
          $('#windSpeed').html(windSpeedString)
          $('#temp').attr('id','cTemp');
          //document.getElementById("button").innerHTML = "Switch to Fahrenheit";
          $('#button').html('Switch to Fahrenheit');
        } else {
          $("#cTemp").html(fTemp + "°F");
          windSpeedString = `Wind from the ${windDirection(windDirectionDegrees)} at ${mph} MPH`;
          $('#windSpeed').html(windSpeedString)
          //document.getElementById("cTemp").id = 'temp';
          
          $('#cTemp').attr('id','temp');

          //document.getElementById("button").innerHTML = "Switch to Celsius"
          $('#button').html('Switch to Celsius');
        }
      });
      
      windSpeedString = `Wind from the ${windDirection(windDirectionDegrees)} at ${mph} MPH`;
      $("#windSpeed").html(windSpeedString);
      image_url = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
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
    state =  geodata.region;


    //$("#gpsCoord").html("latitude: " + lat + "<br>longitude: " + long);
    console.log("Your position is: " + long + "  " + lat);

    //openweather api below
    //api.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid=
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=imperial`
    // api = "https://api.wunderground.com/api/" + apiKey + "/conditions/forecast/alert/q/" + lat + "," + long + ".json";
    console.log(api);
    //$("#apiHere").html("API is: " + api);

    //run function above
    getWeather();

  });
  
});
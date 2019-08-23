//API from openweathermap.com: ef0a6d0921431f9f189ee67b50a9455a

var apiKey = "ef0a6d0921431f9f189ee67b50a9455a";
var long;
var lat;
var fTemp;
var cTemp;
var api;
var windSpeed;
var city;
var state;
var weatherType;
var image_url;
var apiError = "ERROR on API!!!";
var cardinalDirection;
var windSpeedStringF = "";
var windSpeedStringC = "";
var mph;
var mps;
var windDirectionDegrees;
var windDirectionName;
var zipInput;
var zipCode;
var unsplashKey = '5cfedf94261d3f5677df69f8705144fbb9aac1b9200368b3d0208ff2080f1944';
var backgroundUrl;
var queryWeather;

//get wind direction in letters from degrees
function windDirection(degree) {
  //use +11.25 and mod 360 to get (>348.75 and >11.25) or north
  let hexFloor = Math.floor((( (parseFloat(degree) + 11.25) % 360 ) / 360) * 16)
  console.log('Index for array for wind direction', hexFloor);
  // now we can use hexFloor because degree we converted from 1/360 to 1/16 and an array can be used
  let windArray = ['N','NNE', 'NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
  return windArray[hexFloor];
}

function mphToMps(mph) {
  mps = mph * ( 1609.34 / 1) * ((1 / 60) * (1 / 60))
  return parseFloat(mps).toFixed(2) 
}

//define function to get the local weather, run below in doc ready function
function getWeather() { 
  //get object from openweathermaps.com
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
      queryWeather = data.weather[0]['main'];
      if (queryWeather === "Clear") queryWeather = "Clear sky";
      console.log('Query unsplash with this weather term:', queryWeather);
      changeBackground(queryWeather);
      $("#weatherType").html(weatherType);
      fTemp = data.main.temp
      fTemp = fTemp.toFixed(0);
      cTemp = (fTemp - 32) * (5 / 9);
      cTemp = cTemp.toFixed(0);
      $("#cTemp").attr('id', 'temp')
      $("#temp").html(fTemp + "°F");
      $('#button').html('Switch to Celsius');
      windDirectionDegrees = data.wind.deg;
      mph = data.wind.speed;
      mps = mphToMps(mph);
      windDirectionName = windDirection(windDirectionDegrees);    
      windSpeedStringF = windDirectionName ? `Wind from the ${windDirectionName} at ${mph} MPH` : 'No wind Data';
      windSpeedStringC = windDirectionName ? `Wind from the ${windDirectionName} at ${mps} MPS` : 'No wind Data';
      $("#windSpeed").html(windSpeedStringF);
      image_url = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
      document.getElementById("image").src = image_url;
    },
    error: function(data) {
      $("#error").text(data);
      console.log(data);
    }
  });
}

function changeBackground(weatherDescription) {
  //change background
  $.getJSON(`https://api.unsplash.com/search/photos?orientation=landscape&client_id=${unsplashKey}&query=${weatherDescription}`, function(data){
    var randomNumber = Math.floor(Math.random() * 10);
    console.log('Random number for background url:', randomNumber)
    backgroundUrl = data.results[randomNumber].urls.raw
    console.log('object from unsplash api:', data);
    $('#home').css('background-image', `url("${backgroundUrl}")`);
  }).fail(function(){
    console.log("unsplash api failed")
    $('#home').css('background-image', `url("https://res.cloudinary.com/mayerxc/image/upload/v1469059448/bad_weather_wf1sto.jpg")`);
  })
} 

$(document).ready(function() {

  //get location using ipapi
  $.getJSON('https://ipapi.co/json/', function(geodata) {
    lat = geodata.latitude;
    long = geodata.longitude;
    state =  geodata.region;
    console.log("Your position is: " + long + "  " + lat);

    //openweather api below
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=imperial`
    console.log(api);

    //run function above
    getWeather();

  });

  //switch between Fahrenheit and Celsius
  $("#button").click(function() {
    if (document.getElementById("temp") !== null) {
      $("#temp").html(cTemp + "°C");
      $('#windSpeed').html(windSpeedStringC);
      $('#temp').attr('id','cTemp');
      $('#button').html('Switch to Fahrenheit');
    } else {
      $("#cTemp").html(fTemp + "°F");
      $('#windSpeed').html(windSpeedStringF);
      $('#cTemp').attr('id','temp');
      $('#button').html('Switch to Celsius');
    }
  });

  $('#zipInput').keyup(function(event){
    if (event.keyCode === 13) $('#zip').click();
  })


  //https://us-zipcode.api.smartystreets.com/lookup?auth-id=28333260977671425&zipcode=06084
  //look up other zip code
  $("#zip").click(function(zip){
    zipInput = $("#zipInput").val();
    console.log("zipInput is:", zipInput);
    //zip code api
    $.getJSON(`https://us-zipcode.api.smartystreets.com/lookup?auth-id=28333260977671425&zipcode=${zipInput}`, function(data){
      console.log("object from zipcode api:", data);
      try {
        lat = data[0].zipcodes[0].latitude;
        long = data[0].zipcodes[0].longitude;
        state = data[0].zipcodes[0].state;
        api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=imperial`;
        console.log("no error on zip")
        document.getElementById("zip_error").style.display = "none"
        getWeather();
      } catch {
        $("#zip_error").text("Invalid ZIP Code.")
        document.getElementById("zip_error").style.display = "block";
        console.log("error on zip code ");
      }
      
      
    })
    
  })
  
});
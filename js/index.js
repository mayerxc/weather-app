//API from openweathermap.com: ef0a6d0921431f9f189ee67b50a9455a

const openweathermapApiKey = 'ef0a6d0921431f9f189ee67b50a9455a';
const bingMapsKey = 'AlRD-RN6tIrjwoIdY-eAVooqaa9s2xOsAM1r4BtE7uY-X9ZjWFnKvYV-WnAH8FNN';
const unsplashKey = '5cfedf94261d3f5677df69f8705144fbb9aac1b9200368b3d0208ff2080f1944';
const apiError = 'ERROR on API!!!';
let long;
let lat;
let fTemp;
let cTemp;
let openweathermapUrl;
let windSpeed;
let city;
let state;
let formattedCity;
let weatherType;
let image_url;
let cardinalDirection;
let windSpeedStringF = '';
let windSpeedStringC = '';
let mph;
let mps;
let windDirectionDegrees;
let windDirectionName;
let locationInput;
let zipCode;
let backgroundUrl;
let queryWeather;

//get wind direction in letters from degrees
function windDirection(degree) {
  //use +11.25 and mod 360 to get (>348.75 and >11.25) or north
  const hexFloor = Math.floor(
    (((parseFloat(degree) + 11.25) % 360) / 360) * 16
  );
  console.log('Index for array for wind direction', hexFloor);
  // now we can use hexFloor because degree we converted from 1/360 to 1/16 and an array can be used
  const windArray = [
    'N',
    'NNE',
    'NE',
    'ENE',
    'E',
    'ESE',
    'SE',
    'SSE',
    'S',
    'SSW',
    'SW',
    'WSW',
    'W',
    'WNW',
    'NW',
    'NNW',
  ];
  // console.log('windArray[hexFloor]', windArray[hexFloor]);
  return windArray[hexFloor];
}

function mphToMps(mph) {
  mps = mph * (1609.34 / 1) * ((1 / 60) * (1 / 60));
  return parseFloat(mps).toFixed(2);
}

//define function to get the local weather, run below in doc ready function
function getWeather() {
  //get object from openweathermaps.com
  $.ajax({
    dataType: 'json',
    url: openweathermapUrl,
    //data: {},
    success: function (data) {
      console.log('openweathermap data', data);
      // city = data.name;
      $('#city').html(formattedCity);
      console.log('City you are currently in: ' + city + ', ' + state);
      weatherType = data.weather[0]['description'];
      queryWeather = data.weather[0]['main'];
      if (queryWeather === 'Clear') {
        queryWeather = 'Clear sky';
      }
      console.log('Query unsplash with this weather term:', queryWeather);
      changeBackground(queryWeather);
      $('#weatherType').html(weatherType);
      fTemp = data.main.temp;
      fTemp = fTemp.toFixed(0);
      cTemp = (fTemp - 32) * (5 / 9);
      cTemp = cTemp.toFixed(0);
      $('#cTemp').attr('id', 'temp');
      $('#temp').html(fTemp + '°F');
      $('#button').html('Switch to Celsius');
      windDirectionDegrees = data.wind.deg;
      mph = data.wind.speed;
      mps = mphToMps(mph);
      windDirectionName = windDirection(windDirectionDegrees);
      windSpeedStringF = windDirectionName
        ? `Wind from the ${windDirectionName} at ${mph} MPH`
        : 'No wind Data';
      windSpeedStringC = windDirectionName
        ? `Wind from the ${windDirectionName} at ${mps} MPS`
        : 'No wind Data';
      $('#windSpeed').html(windSpeedStringF);
      image_url = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
      $('#image').attr('src', image_url);
    },
    error: function (data) {
      $('#error').text(data);
      console.log(data);
    },
  });
}

function changeBackground(weatherDescription) {
  //change background
  $.getJSON(
    `https://api.unsplash.com/search/photos?orientation=landscape&client_id=${unsplashKey}&query=${weatherDescription}`,
    function (data) {
      const randomNumber = Math.floor(Math.random() * 10);
      console.log('Random number for background url:', randomNumber);
      backgroundUrl = data.results[randomNumber].urls.raw;
      console.log('object from unsplash api:', data);
      $('#home').css('background-image', `url("${backgroundUrl}")`);
    }
  ).fail(function () {
    console.log('unsplash api failed');
    $('#home').css(
      'background-image',
      'url("https://res.cloudinary.com/mayerxc/image/upload/v1469059448/bad_weather_wf1sto.jpg")'
    );
  });
}

$(document).ready(function () {
  // get location using ip address ipapi
  $.getJSON('https://ipapi.co/json/', function (geodata) {
    console.log('https://ipapi.co/json/', geodata);
    lat = geodata.latitude;
    long = geodata.longitude;
    city = geodata.city;
    state = geodata.region_code;
    formattedCity = state ? `${city}, ${state}` : city;
    console.log('Your position is: ' + long + ' ' + lat);

    // openweather api below
    openweathermapUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${openweathermapApiKey}&units=imperial`;
    console.log(openweathermapUrl);

    //run function above
    getWeather();
  }).fail(function () {
    console.log('ipapi.co/json failed!');
  });

  //switch between Fahrenheit and Celsius
  $('#button').click(function () {
    if ($('#temp') !== null) {
      $('#temp').html(cTemp + '°C');
      $('#windSpeed').html(windSpeedStringC);
      $('#temp').attr('id', 'cTemp');
      $('#button').html('Switch to Fahrenheit');
    } else {
      $('#cTemp').html(fTemp + '°F');
      $('#windSpeed').html(windSpeedStringF);
      $('#cTemp').attr('id', 'temp');
      $('#button').html('Switch to Celsius');
    }
  });

  $('#locationInput').keyup(function (event) {
    if (event.keyCode === 13) {
      $('#location').click();
    }
  });

  // bing location key: AlRD-RN6tIrjwoIdY-eAVooqaa9s2xOsAM1r4BtE7uY-X9ZjWFnKvYV-WnAH8FNN
  // https://docs.microsoft.com/en-us/bingmaps/rest-services/locations/find-a-location-by-query

  $('#location').click(function () {
    locationInput = $('#locationInput').val();
    const bingUrl = `https://dev.virtualearth.net/REST/v1/Locations?query=${locationInput}&key=${bingMapsKey}&includeNeighborhood=1&incl=queryParse`;
    console.log('locationInput:', locationInput);
    $.getJSON(bingUrl, function (data) {
      console.log('object from bing zipcode api:', data);
      try {
        lat = data.resourceSets[0].resources[0].point.coordinates[0];
        long = data.resourceSets[0].resources[0].point.coordinates[1];
        console.log('lat: ', lat);
        console.log('long: ', long);
        formattedCity =
          data.resourceSets[0].resources[0].address.formattedAddress;
        // when using zip it displays the zip... change to city/state
        if (!isNaN(formattedCity.charAt(0))) {
          city = data.resourceSets[0].resources[0].address.locality;
          state = data.resourceSets[0].resources[0].address.adminDistrict;
          formattedCity = `${city}${state ? ', ' + state : ''}`;
        }
        openweathermapUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${openweathermapApiKey}&units=imperial`;
        console.log('no error on zip');
        $('#zip_error').css('display', 'none');
        getWeather();
      } catch (error) {
        $('#zip_error').text('Invalid ZIP Code or City.');
        $('#zip_error').css('display', 'block');
        console.log('error on zip code: ', error);
      }
    });
  });
});

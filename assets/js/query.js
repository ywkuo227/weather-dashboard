// Function to generate the URL for Weather API query.
function genWeatherQueryURL(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=";
    var queryUnit = "&units=imperial";
    var queryAppID = "&appid=";
    return queryURL + city + queryUnit + queryAppID + appID;
}

// Function to generate the URL for One Call API query.
function genOneCallQueryURL(lat, lon) {
    var queryURLAndLat = "https://api.openweathermap.org/data/2.5/onecall?lat=";
    var queryLon = "&lon=";
    var queryUnit = "&units=imperial";
    var queryExclude = "&exclude=minutely,hourly,alerts";
    var queryAppID = "&appid=";
    return queryURLAndLat + lat + queryLon + lon + queryUnit + queryExclude+ queryAppID + appID;
}

// Function to generate the URL to retrieve the weather icon.
function genIconURL(icon) {
    var iconURL = "https://openweathermap.org/img/w/";
    var iconFormat = ".png";
    return iconURL + icon +iconFormat;
}
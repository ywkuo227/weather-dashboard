// Array to hold the parsed search history from local storage.
var arySearchHistory = [];

// Function to render search history into buttons underneath the Search input.
function renderSearchHistory() {
    if (JSON.parse(localStorage.getItem("searchHistory")) !== null) {
        arySearchHistory = JSON.parse(localStorage.getItem("searchHistory"));
    }

    $("#searchHistory").empty();
    $("#searchHistory").append(`<hr>`);

    for (i=0; i < arySearchHistory.length; i++) {
        $("#searchHistory").append(`
            <button id="historicalSearchBtn"
            class="mb-3 p-2 w-100 rounded-3 text-dark">${arySearchHistory[i]}</button>
        `);
    }
}

// Page initialization. Calls renderSearchHistory if history inside local storage exists.
function pageInitialize() {
    if (JSON.parse(localStorage.getItem("searchHistory")) !== null) {
        renderSearchHistory();
    }
}

// Calls the OWM Weather API to retrieve the weather of the day and coordinate of the city, before calling OWM One Call API to retrive UV Index and weather forecast.
// Once the responses are received from the APIs, the function renders the corresponding display elements.
// The function also color-code the UV index.
function displayWeather(city) {
    
    fetch(genWeatherQueryURL(city))
        .then((response) => {
            if (!response.ok) {
                throw response.json();
            }
            return response.json();
        })
        .then((weatherData) => {

            fetch(genOneCallQueryURL(weatherData.coord.lat, weatherData.coord.lon))
                .then((response) => {
                    if (!response.ok) {
                        throw response.json();
                    }
                    return response.json();
                })
                .then((oneCallData) => {
                    var uviColor;
                    
                    $("#dailyAnd5DayForecast").empty();

                    if (oneCallData.current.uvi <= 2.99) {
                        uviColor = "bg-success text-white";
                    } else if (oneCallData.current.uvi >= 3 && oneCallData.current.uvi <= 5.99) {
                        uviColor = "bg-warning";
                    } else if (oneCallData.current.uvi >= 6 && oneCallData.current.uvi <= 7.99) {
                        uviColor = "bg-orange";
                    } else if (oneCallData.current.uvi >= 8 && oneCallData.current.uvi <= 10.99) {
                        uviColor = "bg-danger text-white";
                    } else if (oneCallData.current.uvi >= 11) {
                        uviColor = "bg-warning text-white";
                    }

                    $("#dailyAnd5DayForecast").append(`
                        <section id="dailyForecast" class="border border-1 border-dark p-2">
                            <div class="d-flex flex-row">
                            <h2 class="fs-2 fw-bold">${weatherData.name + " (" + moment.unix(weatherData.dt).format("l") + ")"}</h2>
                            <img src="${genIconURL(weatherData.weather[0].icon)}" alt="${weatherData.weather[0].description}">
                            </div>
                            <div class="mt-2 d-grid gap-1">
                                <p>Temp: ${weatherData.main.temp} °F</p>
                                <p>Wind: ${weatherData.wind.speed} MPH</p>
                                <p>Humidity: ${weatherData.main.humidity} %</p>
                                <p>UV Index: <span class="p-1 px-3 rounded ${uviColor}">${oneCallData.current.uvi}</span></p>
                            </div>
                        </section>
                        <section class="mt-3">
                            <h3 class="fs-4 fw-bold">5-Day Forecast:</h3>
                            <div id="fiveDayForecast" class="d-flex flex-row justify-content-between"></div>
                        </section>
                    `);

                    for (i=1;i<6;i++) {
                        $("#fiveDayForecast").append(`
                            <div id="forecastCard" class="p-2">
                                <h4>${moment.unix(oneCallData.daily[i].dt).format("l")}</h4>
                                <img src="${genIconURL(oneCallData.daily[i].weather[0].icon)}" alt="${oneCallData.daily[i].weather.description}">
                                <div class="mt-2">
                                    <p>Temp: ${oneCallData.daily[i].temp.day} °F</p>
                                    <p>Wind: ${oneCallData.daily[i].wind_speed} MPH</p>
                                    <p>Humidity: ${oneCallData.daily[i].humidity} %</p>
                                </div>
                            </div>
                        `)
                    }
                    
                })
        })
}

// Initialize the page.
pageInitialize();

// Upon the search button being clicked, the method calls displayWeather function to retrieve the weather and forecast for the city the user want to search.
// Meanwhile, the method also add the searched city to the front of the array of searched history and store back to the local storage.
$("#searchBtn").on("click", (event) => {
    event.preventDefault();
    displayWeather($("#searchCity").val())
    arySearchHistory.unshift($("#searchCity").val());
    if (arySearchHistory.length > 6) {
        arySearchHistory.length = 6;
    }
    localStorage.clear();
    localStorage.setItem("searchHistory", JSON.stringify(arySearchHistory));
    renderSearchHistory();
});

// When user click on the button represent the past search, the method calls displayWeather function to retrieve eather and forecase of the city.
$("#searchHistory").on("click", (event) => {
    displayWeather(event.target.innerText);
});
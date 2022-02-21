var selectors = {
    searchCityInput: document.querySelector('.search-city-input'),
    searchButton: document.querySelector('.submit-btn'),
    cityNameCardHeader: document.querySelector('.city-name-date'),
    presentTemp: document.querySelector('.present-temp'),
    presentWind: document.querySelector('.present-wind'),
    presentHumidity: document.querySelector('.present-humidity'),
    presentUvi: document.querySelector('.present-uvi'),
    cityWeatherIcon: document.querySelector('.city-weather-icon'),
    historyButtons: document.querySelectorAll('.history-btn'),
}

const citySearches = [];
if (!localStorage.getItem('searches')) {
    localStorage.setItem('searches', JSON.stringify(citySearches));
}

historyButtons();

var cityInput = function (event) {
    var city = selectors.searchCityInput.value;
    if (city) {
        findCoordinates(city);
    } else {
        alert('Enter a city name');
    }
};

var cityCardHeader = function (city, icon) {
    const date = new Date();
    selectors.cityWeatherIcon.src = icon;
    var actualMonth = parseInt(date.getMonth()) + 1;
    var dateHeader = "(" + actualMonth + "/" + date.getDate() + "/" + date.getFullYear() + ")" + " ";
    var header = city + " " + dateHeader;
    selectors.cityNameCardHeader.textContent = header;
}


for (var i = 1; i <= 5; i++) {
    var date = new Date();
    var numberOfDaysToAdd = i;
    var result = date.setDate(date.getDate() + numberOfDaysToAdd);
    var selector = ".card-header-" + i;
    var addedDate = new Date(result);
    var actualMonth = parseInt(addedDate.getMonth()) + 1;
    var dateHeader = "(" + actualMonth + "/" + addedDate.getDate() + "/" + addedDate.getFullYear() + ")" + " ";
    document.querySelector(selector).textContent = dateHeader;
}

var findCoordinates = function (city) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/find?q=' + city + '&appid=5a0652a55a4ce0a056998aad3faa9a83';
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    if (data.list.length > 0) {
                        const lat = data.list[0].coord.lat.toString();
                        const lon = data.list[0].coord.lon.toString();
                        findWeather(lat, lon, city);
                        historyArray(city);
                    } else {
                        alert('Enter a valid city name')
                    }
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to find the city');
        });
};

var historyArray = (newCity) => {
    var searchArrays = JSON.parse(localStorage.getItem('searches'));
    if (searchArrays.length < 10) {
        searchArrays.unshift(newCity);
    } else {
        searchArrays.pop();
        searchArrays.unshift(newCity);
    }
    localStorage.setItem('searches', JSON.stringify(searchArrays));
}

function historyButtons() {
    var history = JSON.parse(localStorage.getItem('searches'));
    var historySize = history.length;
    console.log(historySize);
    if (historySize > 0) {
        for (var i = 0; i < history.length; i++) {
            var selector = ".b" + (i + 1);
            document.querySelector(selector).removeAttribute("hidden");
            document.querySelector(selector).textContent = history[i];
        }
    }
}

var findWeather = function (lat, lon, city) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=hourly,daily,minutely&appid=5a0652a55a4ce0a056998aad3faa9a83&units=imperial';
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    var icon = "https://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png";
                    console.log(icon);
                    cityCardHeader(city.toUpperCase(), icon);
                    selectors.presentTemp.textContent = data.current.temp + "°F";
                    selectors.presentWind.textContent = data.current.wind_speed + " MPH";
                    selectors.presentHumidity.textContent = data.current.humidity + "%";
                    selectors.presentUvi.textContent = data.current.uvi;
                    if (data.current.uvi <= 1) {
                        selectors.presentUvi.style.backgroundColor = "green"
                    } else if (data.current.uvi <= 2) {
                        selectors.presentUvi.style.backgroundColor = "lightgreen"
                    } else if (data.current.uvi <= 3) {
                        selectors.presentUvi.style.backgroundColor = "yellow"
                    } else if (data.current.uvi <= 4) {
                        selectors.presentUvi.style.backgroundColor = "darkgoldenrod"
                    } else if (data.current.uvi <= 5) {
                        selectors.presentUvi.style.backgroundColor = "orange"
                    } else if (data.current.uvi <= 6) {
                        selectors.presentUvi.style.backgroundColor = "orange"
                    } else if (data.current.uvi <= 7) {
                        selectors.presentUvi.style.backgroundColor = "orange"
                    } else if (data.current.uvi <= 8) {
                        selectors.presentUvi.style.backgroundColor = "red"
                    } else if (data.current.uvi <= 9) {
                        selectors.presentUvi.style.backgroundColor = "darkred"
                    } else if (data.current.uvi <= 10) {
                        selectors.presentUvi.style.backgroundColor = "darkred"
                    } else {
                        selectors.presentUvi.style.backgroundColor = "violet"
                    }
                });
            } else {
                alert('Error: ' + response.statusText);
            }
            getWeatherForecast(lat, lon);
        })
        .catch(function (error) {
            alert('Unable to find the city');
        });
}

var getWeatherForecast = function (lat, lon) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=hourly,minutely&appid=5a0652a55a4ce0a056998aad3faa9a83&units=imperial';
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    for (var i = 1; i <= 5; i++) {
                        var icon = "https://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png";
                        var iconSelector = ".card-icon-" + i;
                        var tempSelector = ".card-temp-" + i;
                        var windSelector = ".card-wind-" + i;
                        var humiditySelector = ".card-humidity-" + i;
                        var uviSelector = ".card-uvi-" + i;
                        document.querySelector(iconSelector).src = icon;
                        document.querySelector(tempSelector).textContent = "Temp: " + data.daily[i].temp.max + "°F";
                        document.querySelector(windSelector).textContent = "Wind: " + data.daily[i].wind_speed + " MPH";
                        document.querySelector(humiditySelector).textContent = "Humidity: " + data.daily[i].humidity + "%";
                        document.querySelector(uviSelector).textContent = "UV Index: " + data.daily[i].uvi;
                        if (data.daily[i].uvi <= 1) {
                            document.querySelector(uviSelector).style.backgroundColor = "green"
                        } else if (data.daily[i].uvi <= 2) {
                            document.querySelector(uviSelector).style.backgroundColor = "lightgreen"
                        } else if (data.daily[i].uvi <= 3) {
                            document.querySelector(uviSelector).style.backgroundColor = "yellow"
                        } else if (data.daily[i].uvi <= 4) {
                            document.querySelector(uviSelector).style.backgroundColor = "darkgoldenrod"
                        } else if (data.daily[i].uvi <= 5) {
                            document.querySelector(uviSelector).style.backgroundColor = "orange"
                        } else if (data.daily[i].uvi <= 6) {
                            document.querySelector(uviSelector).style.backgroundColor = "orange"
                        } else if (data.daily[i].uvi <= 7) {
                            document.querySelector(uviSelector).style.backgroundColor = "orange"
                        } else if (data.daily[i].uvi <= 8) {
                            document.querySelector(uviSelector).style.backgroundColor = "red"
                        } else if (data.daily[i].uvi <= 9) {
                            document.querySelector(uviSelector).style.backgroundColor = "darkred"
                        } else if (data.daily[i].uvi <= 10) {
                            document.querySelector(uviSelector).style.backgroundColor = "darkred"
                        } else {
                            document.querySelector(uviSelector).style.backgroundColor = "violet"
                        }
                    }
                    historyButtons();
                });
            }
        })
        .catch(function (error) {
            alert('Unable to get the weather forecasts for the entered city');
        });
}

selectors.searchButton.addEventListener('click', cityInput);
selectors.historyButtons.forEach(item => {
    item.addEventListener('click', function (event) {
    var historyCityName = event.target.textContent;
    findCoordinates(historyCityName);
});
})
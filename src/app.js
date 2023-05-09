function formatDate(timestamp) {
  //calculate the date
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Firday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function displayForecast(forecast) {
  // Get the forecast data for the specific hours
  console.log(forecast);
  let forecastData = [
    forecast.data.list[8],
    forecast.data.list[16],
    forecast.data.list[24],
    forecast.data.list[32],
    forecast.data.list[39],
  ];

  // Loop through the forecast data and update the HTML on the page
  for (let i = 0; i < forecastData.length; i++) {
    let forecastDayElement = document.getElementById(`forecast-day${i + 1}`);
    let forecastTempElement = document.getElementById(`forecast-temp${i + 1}`);
    let iconElements = document.querySelectorAll(".forecastIconElement");

    // Get the forecast date, temperature, and weather condition
    let forecastDate = new Date(forecastData[i].dt_txt);

    let forecastDay = forecastDate.toLocaleDateString("en-US", {
      weekday: "short",
    });
    let forecastTemp = Math.round(forecastData[i].main.temp);

    // Update the HTML on the page with the forecast data
    forecastDayElement.innerHTML = forecastDay;
    forecastTempElement.innerHTML = `${forecastTemp}&deg;C`;
    iconElements[i].setAttribute(
      "src",
      `https://openweathermap.org/img/wn/${forecastData[i].weather[0].icon}@2x.png`
    );
    iconElements[i].setAttribute("alt", forecastData[i].weather[0].description);
  }
}


function getForecast(coordinates) {
  let apiKey = "c73c9f8f4bf23f384bf6fce4a36e9a14";
  let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(response) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#icon");

  celsiusTemperature = response.data.main.temp;

  temperatureElement.innerHTML = Math.round(celsiusTemperature);

  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function search(city) {
  let apiKey = "c73c9f8f4bf23f384bf6fce4a36e9a14";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}
function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#cityInput");
  search(cityInputElement.value);
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  // remove the active class the celsius link
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}
let celsiusTemperature = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

search("New York");

function currentTemperature(timezoneOffset) {
  let now = new Date();
  let localTime = now.getTime();
  let localOffset = now.getTimezoneOffset() * 60000;
  let utcTime = localTime + localOffset;
  let offset = timezoneOffset * 1000;
  let localTimezone = utcTime + offset;
  let date = new Date(localTimezone);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getUTCDay()];
  let dateElement = document.querySelector("#date");
  let options = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
  let timeString = date.toLocaleTimeString([], options);
  dateElement.innerHTML = `${day} ${timeString}`;
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

    let iconElements = document.getElementById(`forecast-icon${i + 1}`);

    // Get the forecast date, temperature, and weather condition
    let forecastDate = new Date(forecastData[i].dt_txt);

    let forecastDay = forecastDate.toLocaleDateString("en-US", {
      weekday: "short",
    });
    let forecastTemp = Math.round(forecastData[i].main.temp);
    let forecastCondition = forecastData[i].weather[0].main;

    // Update the HTML on the page with the forecast data
    forecastDayElement.innerHTML = forecastDay;
    forecastTempElement.innerHTML = `${forecastTemp}&deg;C`;
    iconElements.src = getIconUrl(forecastCondition);
  }
}

function getIconUrl(condition) {
  switch (condition) {
    case "Clear":
      return "images/clear.svg";
    case "Clouds":
      return "images/clouds.svg";
    case "Rain":
    case "Drizzle":
      return "images/rain.svg";
    case "Thunderstorm":
      return "images/thunderstorm.svg";
    case "Snow":
      return "images/snow.svg";
    default:
      return "images/unknown.svg";
  }
}

function getForecast(coordinates) {
  let apiKey = "c73c9f8f4bf23f384bf6fce4a36e9a14";
  let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(response) {
  console.log(response);
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let dateElement = document.querySelector("#date");
  let exactDateElement = document.querySelector("#exactDate");

  celsiusTemperature = response.data.main.temp;

  temperatureElement.innerHTML = Math.round(celsiusTemperature);

  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);

  let now = new Date();
  let date = now.getDate();
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[now.getMonth()];
  exactDateElement.innerHTML = `${date} ${month}`;
  let condition = response.data.weather[0].main;

  let icon = document.getElementById("icon");

  // Set the icon source based on the weather condition
  switch (condition) {
    case "Clear":
      icon.src = "images/clear.svg";
      break;
    case "Clouds":
      icon.src = "images/clouds.svg";
      break;
    case "Rain":
    case "Drizzle":
      icon.src = "images/rain.svg";
      break;
    case "Thunderstorm":
      icon.src = "images/thunderstorm.svg";
      break;
    case "Snow":
      icon.src = "images/snow.svg";
      break;
    default:
      icon.src = "images/unknown.svg";
      break;
  }

  // Call this function with the weather condition as an argument to set the appropriate background image.

  getForecast(response.data.coord);
}

function search(city) {
  let apiKey = "c73c9f8f4bf23f384bf6fce4a36e9a14";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(function (response) {
    let timezoneOffset = response.data.timezone;
    displayTemperature(response);
    currentTemperature(timezoneOffset); // Pass the timezone offset to the function
  });
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

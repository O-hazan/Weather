let now = new Date();
let h6 = document.querySelector("h6");
let h2 = document.querySelectorAll("h2");
let date = now.getDate();
let hour = now.getHours();
let minutes = now.getMinutes();
let year = now.getFullYear();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[now.getDay()];
let tomorrow = days[now.getDay() + 1];
let nextDays = [
  days[now.getDay() + 1],
  days[now.getDay() + 2],
  days[now.getDay() + 3],
  days[now.getDay() + 4],
  days[now.getDay() + 5],
  days[now.getDay() + 6],
];
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
let celsius = document.querySelector("#metric");
let fahrenheit = document.querySelector("#imperial");
let month = months[now.getMonth()];
let cur = 0;
const form = document.querySelector("#form");
const searchSubmit = document.querySelector(".searchSub");
const currentButton = document.querySelector("#current-button");
const currentCity = document.querySelector("#city");

function changeToCelsiusHandler() {
  changeTempFormat("metric");
  celsius.classList.replace("unselected", "selected");
  fahrenheit.classList.replace("selected", "unselected");
}

function changeToFahrenheitHandler() {
  changeTempFormat("imperial");
  fahrenheit.classList.replace("unselected", "selected");
  celsius.classList.replace("selected", "unselected");
}

function changeTempFormat(method) {
  const currentCity = document.querySelector("#city");
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${currentCity.textContent}&units=${method}`;
  let apiKey = "047a16ee4ff9c5f736393bccc1c2faad";
  let fullApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${currentCity.textContent}&units=${method}`;
  let format = setUnitFormat(method);
  axios.get(`${apiUrl}&appid=${apiKey}`).then((res) => {
    showTemperature(res, format);
  });
  axios.get(`${fullApiUrl}&appid=${apiKey}`).then((res) => {
    showHourlyForcast(res);
    showNextDaysForcast(res);
  });
}

function setUnitFormat(method) {
  let format = "";
  if (method === "imperial") {
    format = "°F";
  } else if (method === "metric") {
    format = "°C";
  }
  return format;
}

function showTemperature(response, format = "°C") {
  const temperatureElement = document.querySelector("#currentTemp");
  const minTempEl = document.querySelector("#minTemp");
  const maxTempEl = document.querySelector("#maxTemp");
  const icon = document.getElementById("icon");
  const imgId = response.data.weather[0].icon;
  const data = {
    temperature: Math.round(response.data.main.temp),
    minTemp: Math.round(response.data.main.temp_min),
    maxTemp: Math.round(response.data.main.temp_max),
    imageUrl: `http://openweathermap.org/img/wn/${imgId}@2x.png`,
    currentCityName: response.data.name,
  };
  temperatureElement.textContent = `${data.temperature}${format}`;
  icon.setAttribute("src", data.imageUrl);
  minTempEl.innerHTML = `Min ${data.minTemp}${format}`;
  maxTempEl.innerHTML = `Max ${data.maxTemp}${format}`;
  currentCity.innerHTML = data.currentCityName;
}

function displayCityHandler(event) {
  let selectedFormat = document.querySelector(".selected").id;
  let apiKey = "047a16ee4ff9c5f736393bccc1c2faad";
  let city = document.querySelector("#searchBox").value;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${selectedFormat}`;
  let fullApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${selectedFormat}`;
  selectedFormat = setUnitFormat(selectedFormat);
  event.preventDefault();

  axios
    .get(`${apiUrl}&appid=${apiKey}`)
    .then((response) => {
      showTemperature(response, selectedFormat);
    })
    .catch((error) => {
      alert(`City ${error.response.statusText}`);
    });

  axios
    .get(`${fullApiUrl}&appid=${apiKey}`)
    .then((res) => {
      showHourlyForcast(res);
      showNextDaysForcast(res);
    })
    .catch((error) => {});
}

function searchLocation(position) {
  let selectedFormat = document.querySelector(".selected").id;
  let latitud = position.coords.latitude;
  let longitud = position.coords.longitude;
  let apiKey = "047a16ee4ff9c5f736393bccc1c2faad";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitud}&lon=${longitud}&appid=${apiKey}&units=${selectedFormat}`;
  let fullApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitud}&lon=${longitud}&appid=${apiKey}&units=${selectedFormat}`;
  let format = setUnitFormat(selectedFormat);
  axios.get(`${apiUrl}&appid=${apiKey}`).then((res) => {
    showTemperature(res, format);
  });
  axios.get(`${fullApiUrl}&appid=${apiKey}`).then((res) => {
    showHourlyForcast(res);
    showNextDaysForcast(res);
  });
}

function showHourlyForcast(res) {
  const list = res.data.list;
  const listEl = document.querySelector("#hourly");
  const HourListElements = listEl.querySelectorAll("#hour");
  const TempListEl = document.querySelector("#tempMain");
  const TempListElements = TempListEl.querySelectorAll("#temp");
  const iconEl = document.querySelector("#icon2Main");
  const iconElements = iconEl.querySelectorAll("#icon2");
  let i = 0;
  HourListElements.forEach((element) => {
    let hour1 = list[i].dt_txt[11];
    let hour2 = list[i].dt_txt[12];
    element.innerHTML = `${hour1}${hour2}`;
    i++;
  });
  i = 0;
  iconElements.forEach((el) => {
    let imgId = res.data.list[i].weather[0].icon;
    let iconUrl = `http://openweathermap.org/img/wn/${imgId}@2x.png`;

    el.setAttribute("src", iconUrl);
    i++;
  });
  i = 0;
  let unit = "°C";
  TempListElements.forEach((el) => {
    let temp = Math.round(list[i].main.temp);
    el.innerHTML = `${temp}°`;
    i++;
  });
}

function showNextDaysForcast(res1) {
  const minMaxMain = document.querySelector("#minMaxMain");
  const maxElements = document.querySelectorAll("#max");
  const minElements = document.querySelectorAll("#min");
  const iconElements = document.querySelectorAll("#icon3");
  const list1 = res1.data.list;
  let i = 8;
  minElements.forEach((element) => {
    let minTemp = Math.round(res1.data.list[i].main.temp_min);
    element.innerHTML = `Min ${minTemp}°`;
    i += 8;
  });
  i = 8;
  maxElements.forEach((element) => {
    let maxTemp = Math.round(res1.data.list[i].main.temp_max);
    element.innerHTML = `Max ${maxTemp}°`;
    i += 8;
  });
  i = 8;
  iconElements.forEach((element) => {
    let iconId = res1.data.list[i].weather[0].icon;
    let iconUrl = `http://openweathermap.org/img/wn/${iconId}@2x.png`;
    element.setAttribute("src", iconUrl);
    i += 8;
  });
}

function getCurrentLocationHandler(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

h6.innerHTML = `${day} ${month} ${date}st ${year}, ${hour}:${minutes}`;

h2.forEach((element) => {
  element.innerHTML = `${nextDays[cur]}`;
  cur++;
});

searchBox.onkeyup = function () {
  let city = document.querySelector("#searchBox").value;
  if (city == "") {
    searchSubmit.setAttribute("disabled", true);
  } else {
    searchSubmit.removeAttribute("disabled");
  }
};

navigator.geolocation.getCurrentPosition(searchLocation, (params) => {
  alert(params.message);
});

currentButton.onmouseover = function () {
  currentButton.style.backgroundColor = "lightBlue";
};

currentButton.onmouseleave = function () {
  currentButton.style.backgroundColor = "white";
};

celsius.addEventListener("click", changeToCelsiusHandler);
fahrenheit.addEventListener("click", changeToFahrenheitHandler);
form.addEventListener("submit", displayCityHandler);
currentButton.addEventListener("click", getCurrentLocationHandler);

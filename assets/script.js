var searchButton = document.getElementById("search_button");
var searchInput = document.getElementById("search_input");
var cityTitle = document.getElementById("city_title");
var tempEl = document.getElementById("temp");
var windEl = document.getElementById("wind");
var humidityEl = document.getElementById("humidity");
var multiDayWrapper = document.getElementById("5_day_wrapper");
var buttonList = document.getElementById("previous_list");
var city;

async function searchAndGetWeather(searchTerm) {
  let inputs = searchTerm.split(',');
  city = {name: inputs[0].trim(), state:inputs[1].trim()};
  //fetch coords from city name
  fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city.name},${city.state},US&limit=1&appid=78025875a9c545a4d2f7c151cc462ba9
  `)
  .then((response) => response.json())
  .then((data) => {
    return fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${data[0].lat}&lon=${data[0].lon}&units=imperial&appid=78025875a9c545a4d2f7c151cc462ba9`)
  })
  .then((res) => res.json())
  .then(data => updateDisplay(data.list));
}

function updateDisplay(weatherArray) {
  multiDayWrapper.innerHTML = '';
  let forecastTitle = document.createElement("h2")
  forecastTitle.innerHTML = "5-day forecast";
  multiDayWrapper.appendChild(forecastTitle);
  for (let i = 0; i < (weatherArray.length - 1); i+=8) {
    console.log(weatherArray[i])
    let temp = weatherArray[i].main.temp;
    let humidity = weatherArray[i].main.humidity;
    let wind = weatherArray[i].wind.speed;
    let date = weatherArray[i].dt_txt.split(' ',1)[0];

    if (i === 0) {
      cityTitle.innerText = `${city.name} ${date}`;
      tempEl.innerText = `${temp} °F`;
      windEl.innerText = `${wind} MPH`;
      humidityEl.innerText = `${humidity} %`;
    }

    makeCard({date, temp, humidity, wind});
    
  }
}

function makeCard(weather) {
  let card = document.createElement("div");
  card.setAttribute("class", "col card");
  let body = document.createElement("div");
  body.setAttribute("class", "card-body");
  card.appendChild(body);
  let title = document.createElement("div");
  title.innerHTML = weather.date;
  title.setAttribute("class", "card-title");
  body.appendChild(title);
  let temp = document.createElement("div");
  temp.setAttribute("class", "card-text");
  temp.innerHTML = `${weather.temp} °F`
  let humidity = document.createElement("div");
  humidity.setAttribute("class", "card-text");
  humidity.innerHTML = `${weather.humidity} %`
  let wind = document.createElement("div");
  wind.setAttribute("class", "card-text");
  wind.innerHTML = `${weather.wind} MPH`

  body.appendChild(temp);
  body.appendChild(humidity);
  body.appendChild(wind);

  multiDayWrapper.appendChild(card); 
}

function handleSearchClick() {
  searchAndGetWeather(searchInput.value)

  let recentButton = document.createElement("button");
  recentButton.setAttribute("class", "btn btn-secondary");
  recentButton.innerHTML = searchInput.value;
  buttonList.appendChild(recentButton);
}

function handleListClick(e) {
  if (e.target.tagName === "BUTTON") {
    searchAndGetWeather(e.target.innerHTML);
  }
}

searchButton.addEventListener("click", handleSearchClick);
buttonList.addEventListener("click", handleListClick);

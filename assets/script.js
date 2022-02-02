
function displayWeather(data, cityName) {
    //clear any previous results
    document.querySelector("#currentWeather").innerHTML = "";
    document.querySelector("#weekForecast").innerHTML = "";

    let historyBtn = document.createElement("button");
    let historyLink = document.createElement("a")
    historyLink.innerHTML = cityName;
    historyLink.setAttribute("href", `file:///C:/Users/Brian/code/weatherWeek/index.html?text=${cityName}`);
    historyBtn.appendChild(historyLink);
    document.querySelector("#historyList").appendChild(historyBtn);

    const cityTitle = document.createElement("h3");
    cityTitle.innerHTML = `${cityName} <img src="http://openweathermap.org/img/wn/${data.current.weather[0].icon}.png">`;

    const today = document.createElement("div");
    today.innerHTML = `${moment.unix(data.current.dt).format("ddd MMM Do, YYYY")}`;

    cityTitle.appendChild(today)

    const currentDiv = document.createElement("div");
    currentDiv.classList.add("container");
    currentDiv.classList.add("currentDiv");
    currentDiv.innerHTML = `<div class="row"><div class="col-6">Tempature:</div><div class="col-6 p-0">${data.current.temp} F</div></div>
    <div class="row"><div class="col-6">Humidity:</div><div class="col-6 p-0">${data.current.humidity} %</div></div>
    <div class="row"><div class="col-6">Wind:</div><div class="col-6 p-0">${data.current.wind_speed.toFixed(1)} MPH</div></div>
    <div class="row"><div class="col-6">UVI:</div><div id="uvi">${data.current.uvi}</div></div>`;
    //color code the uv index to show a color for favorable, moderate, and severe conditions
    

    document.querySelector("#currentWeather").appendChild(cityTitle);
    document.querySelector("#currentWeather").appendChild(currentDiv);

    if (data.current.uvi < 3) {
        document.getElementById("uvi").setAttribute("class", "bg-g col-2");
    } else if(data.current.uvi >= 3 && data.current.uvi < 6) {
        document.getElementById("uvi").setAttribute("class", "bg-y col-2");
    } else {
        document.getElementById("uvi").setAttribute("class", "bg-r col-2");
    }

    for(i = 1; i < 6; i++) {
        
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("weatherCard");
        const day = document.createElement("h4");
        day.textContent = `${moment.unix(data.daily[i].dt).format("dddd, MMM Do")}`;
        const weatherIcon = document.createElement("img");
        weatherIcon.setAttribute("src", `http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}.png`)
        const tempParDiv = document.createElement("p");
        tempParDiv.textContent = `Temp:     ${data.daily[i].temp.max} F`;
        const windParDiv = document.createElement("p");
        windParDiv.textContent = `Wind: ${data.daily[i].wind_speed} MPH`;
        const humParDiv = document.createElement("p");
        humParDiv.textContent = `Humidity:    ${data.daily[i].humidity} %`;

        cardDiv.appendChild(day);
        cardDiv.appendChild(weatherIcon)
        cardDiv.appendChild(tempParDiv);
        cardDiv.appendChild(windParDiv);
        cardDiv.appendChild(humParDiv);

        document.querySelector("#weekForecast").appendChild(cardDiv);
    }
}

function getCoordinates(event) {
    event.preventDefault();

    const city = document.getElementById("citySearch").value;
    const fetchUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=13aee28c8aa564f699d833de5603c365`;

    fetch(fetchUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function(coordinates) {
        console.log(coordinates);
        getWeather(coordinates)
    })

}

function getWeather(coordinates) {
    const lat = coordinates.coord.lat;
    const lon = coordinates.coord.lon;
    const name = coordinates.name
    const weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=13aee28c8aa564f699d833de5603c365`;
    
        fetch(weatherUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            displayWeather(data, name);
        })

}

document.querySelector("#searchBtn").addEventListener("click", getCoordinates);
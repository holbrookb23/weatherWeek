// array of searched cities
const cities = [];

// displays current and future weather conditions
function displayWeather(data, cityName) {

    //makes section visible
    document.querySelector("#weatherDisplay").style["visibility"] = "visible";
    //clear any previous results
    document.querySelector("#currentWeather").innerHTML = "";
    document.querySelector("#weekForecast").innerHTML = "";

    // display city name and weather icon
    const cityTitle = document.createElement("h3");
    cityTitle.innerHTML = `${cityName} <img src="http://openweathermap.org/img/wn/${data.current.weather[0].icon}.png">`;
    //Display the date
    const today = document.createElement("div");
    today.innerHTML = `${moment.unix(data.current.dt).format("dddd MMM Do, YYYY")}`;

    cityTitle.appendChild(today)
    // shows different weather stats
    const currentDiv = document.createElement("div");
    currentDiv.classList.add("container");
    currentDiv.classList.add("w-80-sm")
    currentDiv.classList.add("currentDiv");
    currentDiv.innerHTML = `<div class="row"><div class="col-5">Tempature:</div><div class="col-6 p-0">${data.current.temp} F</div></div>
    <div class="row"><div class="col-5">Humidity:</div><div class="col-6 p-0">${data.current.humidity} %</div></div>
    <div class="row"><div class="col-5">Wind:</div><div class="col-6 p-0">${data.current.wind_speed.toFixed(1)} MPH</div></div>
    <div class="row"><div class="col-5">UVI:</div><div id="uvi">${data.current.uvi}</div></div>`;
    

    document.querySelector("#currentWeather").appendChild(cityTitle);
    document.querySelector("#currentWeather").appendChild(currentDiv);
    //checks uvi rating and changes colors upon amount of safety
    if (data.current.uvi < 3) {
        document.getElementById("uvi").setAttribute("class", "bg-g col-2 ta-c");
    } else if(data.current.uvi >= 3 && data.current.uvi < 6) {
        document.getElementById("uvi").setAttribute("class", "bg-y col-2 ta-c");
    } else {
        document.getElementById("uvi").setAttribute("class", "bg-r col-2 ta-c");
    }

    //creates weather cards for the next five days
    for(i = 1; i < 6; i++) {
        
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("weatherCard");
        const day = document.createElement("h4");
        day.textContent = `${moment.unix(data.daily[i].dt).format("dddd, MMM Do")}`;
        const weatherIcon = document.createElement("img");
        weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}.png`)
        const tempParDiv = document.createElement("p");
        tempParDiv.textContent = `Temp:     ${data.daily[i].temp.max} F`;
        const windParDiv = document.createElement("p");
        windParDiv.textContent = `Wind: ${data.daily[i].wind_speed.toFixed(1)} MPH`;
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

//gets the appropriate city data based off of city name
function getCoordinates(city) {
    
    const fetchUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=13aee28c8aa564f699d833de5603c365`;

    fetch(fetchUrl)
    .then(function(response) {
        if(response.ok) {
            return response.json();
        } else {
            //if city doesn't exist it is removed from the aside buttons
            cities.pop();
            document.querySelector("#historyList").innerHTML = "";
            cities.forEach((city) => {
                document.querySelector("#historyList").innerHTML += `<button data-city="${city}" class="aside-btn d-block my-2">${city}</button>`;
            });
            errorMessage("We can't find your city :(");
        }
    })
    .then(function(coordinates) {
        getWeather(coordinates)
    })
    

}

//displays message if cant find city
function errorMessage(message) {
    document.getElementById("currentWeather").innerHTML = `<div class="ta-c">${message}</div>`;
    document.getElementById("weekForecast").innerHTML = "";
}

//gets weather data based off coordinates
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
            displayWeather(data, name);
        })

}


//creates button of city and sends name to get data
function handleFormSubmit(event) {
    document.querySelector("#historyList").innerHTML = "";
    event.preventDefault();
    const city = document.getElementById("citySearch").value.toLowerCase();
    if(!city === cities.includes(city, 0)) {
        cities.push(city);
        cities.forEach((city) => {
            document.querySelector("#historyList").innerHTML += `<button data-city="${city}" class="aside-btn d-block my-2">${city}</button>`;
        });
    } else {

        cities.forEach((city) => {
            document.querySelector("#historyList").innerHTML += `<button data-city="${city}" class="aside-btn d-block my-2">${city}</button>`;
        });
    }
            
    getCoordinates(city);
}

//handles city aside buttons
function handleButton(event) {
    const city = event.target.getAttribute("data-city");
    getCoordinates(city);
}

//event listeners
document.querySelector("#searchBtn").addEventListener("click", handleFormSubmit);

document.getElementById("historyList").addEventListener("click", handleButton);
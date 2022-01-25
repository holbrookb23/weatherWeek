





function displayWeather(data) {
    //clear any previous results
    document.querySelector("#currentWeather").innerHTML = "";

    const cityTitle = document.createElement("h3");
    cityTitle.textContent = `${data.timezone} ${data.current.weather[0].main}`;

    const tempPar = document.createElement("p");
    tempPar.textContent = `Tempature: ${data.current.temp}F`;

    const humPar = document.createElement("p");
    humPar.textContent = `Humidity: ${data.current.humidity}%`;

    const windPar = document.createElement("p");
    windPar.textContent = `Wind: ${data.current.wind_speed} MPH`;

    const uviPar = document.createElement("p");
    uviPar.textContent = `UV Index: ${data.current.uvi}`
    //color code the uv index to show a color for favorable, moderate, and severe conditions

    document.querySelector("#currentWeather").appendChild(cityTitle);
    document.querySelector("#currentWeather").appendChild(tempPar);
    document.querySelector("#currentWeather").appendChild(humPar);
    document.querySelector("#currentWeather").appendChild(windPar);
    document.querySelector("#currentWeather").appendChild(uviPar);

    for(i = 1; i < 6; i++) {
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("weatherCard");
        const tempParDiv = document.createElement("p");
        tempParDiv.textContent = `Temp: ${data.daily[i].temp.max}F`;
        const windParDiv = document.createElement("p");
        windParDiv.textContent = `Wind: ${data.daily[i].wind_speed} MPH`;
        const humParDiv = document.createElement("p");
        humParDiv.textContent = `Humidity: ${data.daily[i].humidity}%`;

        cardDiv.appendChild(tempParDiv);
        cardDiv.appendChild(windParDiv);
        cardDiv.appendChild(humParDiv);

        document.querySelector("#weekForecast").appendChild(cardDiv);
    }
}

function getWeather() {
    
    const weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=33.4&lon=-94.04&units=imperial&appid=${apiKey}`;

    fetch(weatherUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);
        displayWeather(data);
    })


}

document.querySelector("#searchBtn").addEventListener("click", getWeather);
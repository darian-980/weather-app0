import "./styles.css";
import { API_KEY } from "./keys.js";

function fetchJson(location = "Toronto", unitGroup = "metric") {
    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=${unitGroup}&key=${API_KEY}&contentType=json`)
        .then(response => {
            if (!response.ok) { //checks for bad server responses (even if the response is successful) 
                throw new Error(`HTTP error, status: ${response.status}`);
            }
            return response.json(); //parses it to json so that it can be used in the next .then
        })
        .then(response => {
            console.log(response);
            displayWeatherData(response);
            changeStyle(response);
        })
        .catch(error => { //any errors that happen during the .then are caught by the .catch
            console.error("Error fetching a weather json from the source:", error);
        });
};

function displayWeatherData(data) {
    const weatherContainer = document.getElementById("weatherDataContainer");
    weatherContainer.innerHTML = "";
    const unitValue = document.getElementById("unitGroup")?.value;
    let degree = "°C";
    if (unitValue === "us") {
        degree = "°F";
    };

    const location = document.createElement("div");
    location.textContent = `location: ${data.address}`;
    location.setAttribute("class", "largerItem");
    weatherContainer.appendChild(location);

    const conditions = document.createElement("div");
    conditions.textContent = `condition: ${data.currentConditions.conditions}`;
    conditions.setAttribute("class", "largerItem");
    weatherContainer.appendChild(conditions);

    const temperature = document.createElement("div");
    temperature.textContent = `temperature: ${data.currentConditions.temp}${degree}`;
    temperature.setAttribute("class", "largerItem");
    weatherContainer.appendChild(temperature);

    const humidity = document.createElement("div");
    humidity.textContent = `humidity: ${data.currentConditions.humidity}%`;
    humidity.setAttribute("class", "largerItem");
    weatherContainer.appendChild(humidity);

    const description = document.createElement("div");
    description.textContent = `${data.description}`;
    description.setAttribute("class", "smallerItem");
    weatherContainer.appendChild(description);
}

function changeStyle(data) {
    const body = document.querySelector("body");
    const container = document.getElementById("container");
    const weatherContainer = document.getElementById("weatherDataContainer");

    const weatherConditionIndex = data.currentConditions.conditions.split(","); //splits any weather conditions that have commas,
    const weatherConditionString = weatherConditionIndex[0].toLowerCase(); //chooses the first weather condition ex. rain, cloudy => rain
    // console.log(weatherConditionString);

    if (weatherConditionString === "clear") {
        body.setAttribute("class", "clearBody");
        container.setAttribute("class", "clearContainer");
        weatherContainer.setAttribute("class", "clearWeatherDataContainer");
    } else if (weatherConditionString === "overcast") {
        body.setAttribute("class", "overcastBody");
        container.setAttribute("class", "overcastContainer");
        weatherContainer.setAttribute("class", "overcastWeatherDataContainer");
    } else if (weatherConditionString === "partially cloudy") {
        body.setAttribute("class", "partialCloudyBody");
        container.setAttribute("class", "partialCloudyContainer");
        weatherContainer.setAttribute("class", "partialCloudyWeatherDataContainer");
    } else if (weatherConditionString === "rain") {
        body.setAttribute("class", "rainBody");
        container.setAttribute("class", "rainContainer");
        weatherContainer.setAttribute("class", "rainWeatherDataContainer");
    } else if (weatherConditionString === "snow") {
        body.setAttribute("class", "snowBody");
        container.setAttribute("class", "snowContainer");
        weatherContainer.setAttribute("class", "snowWeatherDataContainer");
    }
}

function searchValue() {
    const searchBoxValue = document.getElementById("searchBox")?.value;
    const unitValue = document.getElementById("unitGroup")?.value;
    if (searchBoxValue && searchBoxValue.replace(/\s/g, "") !== "") {
        fetchJson(searchBoxValue, unitValue);
    }
    else {
        fetchJson("Toronto", unitValue); //Toronto is the default value if the bar is left empty
    }
}

const fetchButton = document.getElementById("fetchWeather");
fetchButton.addEventListener("click", () => {
    searchValue();
    console.log("fetch button pressed")
});

// fetchJson();
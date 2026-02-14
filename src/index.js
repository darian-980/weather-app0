import "./styles.css";
import { API_KEY } from "./keys.js";

console.log("test12");

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
    weatherContainer.appendChild(location);

    const conditions = document.createElement("div");
    conditions.textContent = `condition: ${data.currentConditions.conditions}`;
    weatherContainer.appendChild(conditions);

    const temperature = document.createElement("div");
    temperature.textContent = `temperature: ${data.currentConditions.temp}${degree}`;
    weatherContainer.appendChild(temperature);

    const humidity = document.createElement("div");
    humidity.textContent = `humidity: ${data.currentConditions.humidity}%`;
    weatherContainer.appendChild(humidity);

    const description = document.createElement("div");
    description.textContent = `description: ${data.description}`;
    weatherContainer.appendChild(description);
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
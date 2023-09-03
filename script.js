const apiKey = "b1b3ab00da4bd29aa3799b6c558a755b";

const fetchButton = document.getElementById("button");
const map = document.getElementById("googleMap");
const landing = document.getElementById("hidden");
const container = document.getElementById("display");
const currentLocation = document.getElementById("latitude");
const detail = document.getElementById("detail");

function initMap(latitude, longitude) {
    map.src = `https://maps.google.com/maps?q=${latitude}, ${longitude}&z=18&output=embed`
    currentLocation.innerHTML = `<p>Lat: ${latitude}</p>
                                 <p>Long: ${longitude}</p>`
}

async function currentWeather(latitude, longitude) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
    try {
        const response = await fetch(url);
        const weather = await response.json();
        displayData(weather);
    } catch (error) {
        console.log(error);
    }
}

function degreeToDirection(degree) {
    if (degree >= 337.5 || degree < 22.5) {
        return 'North';
    } else if (degree >= 22.5 && degree < 67.5) {
        return 'North East';
    } else if (degree >= 67.5 && degree < 112.5) {
        return 'East';
    } else if (degree >= 112.5 && degree < 157.5) {
        return 'South East';
    } else if (degree >= 157.5 && degree < 202.5) {
        return 'South';
    } else if (degree >= 202.5 && degree < 247.5) {
        return 'South West';
    } else if (degree >= 247.5 && degree < 292.5) {
        return 'West';
    } else {
        return 'North West';
    }
}

function secondsToTimeZoneString(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    const sign = hours >= 0 ? '+' : '-';
    return {sign, hours: Math.abs(hours), minutes, seconds: remainingSeconds };
}

function displayData(weather) {
    const locationName = weather.name;
    const speed = Math.round((weather.wind.speed) * 3.6);
    const humidity = weather.main.humidity;
    const time = secondsToTimeZoneString(weather.timezone);
    const pressure = Math.round((weather.main.pressure) / 1013.25);
    const direction = degreeToDirection(weather.wind.deg);
    // uv index
    const temp = Math.round(weather.main.temp - 273.15);

    detail.innerHTML = `<div>Location: ${locationName}</div>
                        <div>Wind Speed: ${speed}kmph</div>
                        <div>Humidity: ${humidity} %</div>
                        <div>Time Zone: GMT ${time.sign}${time.hours}:${time.minutes}</div>
                        <div>Pressure: ${pressure}atm</div>
                        <div>Wind Direction: ${direction}</div>
                        <div></div>
                        <div>Feels like: ${temp}° C</div>
                       `
}

function fetchLocationData() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            initMap(latitude, longitude);
            currentWeather(latitude, longitude);

        }, function (error) {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    alert("User denied the request for Geolocation.");
                    break;
                case error.POSITION_UNAVAILABLE:
                    alert("Location information is unavailable.");
                    break;
                case error.TIMEOUT:
                    alert("The request to get user location timed out.");
                    break;
                case error.UNKNOWN_ERROR:
                    alert("An unknown error occurred.");
                    break;
            }
        });
    } else {
        alert("Geolocation is not supported in this browser.");
    }
}

fetchButton.addEventListener("click", () => {
    fetchLocationData();
    landing.style.display = "none";
    container.style.display = "contents";
});
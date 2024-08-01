let isCelsius = true;
let isEnglish = true;

const translations = {
    en: {
        city: "City:",
        state: "State:",
        getWeater: "Get Weather",
        getForecast: "Get Forecast",
        unitsMeasure: "Change Units of Measurement",
        language: "EN/ES",
        currentWeather: "Current Weather",
        getForecast:"Weekly Forecast"
    },
    es: {
        city: "Ciudad:",
        state: "Estado:",
        getWeather: "Obtener el clima",
        getForecast: "Obtener el pronóstico",
        unitsMeasure: "Cambiar unidades",
        language:"EN/ES",
        currentWeather: "Clima actual",
        getForecast:"Pronóstico semenal"
    }

};


document.getElementById('getWeather').addEventListener('click', function(){  // Event listener when Get Weather button is pushed
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const apiKey = 'b2af4ce301674059b88135b7ea8aa42a';
    const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${city},${state}&key=${apiKey}`;

    fetch(geocodeUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.results.length > 0) {
            const { lat, lng } = data.results[0].geometry;
            fetchWeather(lat, lng);
        } else {
            throw new Error('Location not found');
        }
    })
    .catch(error => {
        console.error('Error fetching geocoding data:', error);
        document.getElementById('weather').innerHTML = 'Error fetching location data. Please try again.';
    });
});

document.getElementById('getForecast').addEventListener('click', function(){ // Event listener when Get Forecast button is pushed
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const apiKey = 'b2af4ce301674059b88135b7ea8aa42a';
    const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${city},${state}&key=${apiKey}`;

    fetch(geocodeUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.results.length > 0) {
            const { lat, lng } = data.results[0].geometry;
            fetchForecast(lat, lng);
        } else {
            throw new Error('Location not found');
        }
    })
    .catch(error => {
        console.error('Error fetching geocoding data:', error);
        document.getElementById('forecast').innerHTML = 'Error fetching location data. Please try again.';
    });
});

document.getElementById('unitsMeasure').addEventListener('click', function(){
    isCelsius = !isCelsius;
    updateWeatherDisplay();
    updateForecastDisplay();
});

document.getElementById('language').addEventListener('click',function(){
    isEnglish = !isEnglish;
    updatePageLanguage();
    updateWeatherDisplay();
    updateForecastDisplay();
});

function fetchWeather(lat, lng) { // Function to return value for get current weather for the given city and state.
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`;
    fetch(weatherUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const weatherDiv = document.getElementById('weather');
            const currentWeather = data.current_weather.temperature;
            weatherDiv.innerHTML = `
                <h2>Current Weather</h2>
                <p>Temperature: ${currentWeather} °C</p>
            `;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            document.getElementById('weather').innerHTML = 'Error fetching weather data. Please try again.';
        });
}

function fetchForecast(lat, lng) { // Function to return the forecast for the given city and state.
    const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min`;
    fetch(forecastUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const forecastDiv = document.getElementById('forecast');
            let forecastHTML = '<h2>Weekly Forecast</h2>';
            data.daily.temperature_2m_max.forEach((maxTemp, index) => {
                const minTemp = data.daily.temperature_2m_min[index];
                forecastHTML += `
                    <p>Day ${index + 1}: Max: ${maxTemp} °C, Min: ${minTemp} °C</p>
                `;
            });
            forecastDiv.innerHTML = forecastHTML;
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
            document.getElementById('forecast').innerHTML = 'Error fetching forecast data. Please try again.';
        });
}

function updateWeatherDisplay(){
    const weatherDiv = document.getElementById('weather');
    const temperature = parseFloat(weatherDiv.dataset.temperature);
    const displayTemp = isCelsius ? temperature : (temperature * 9/5) + 32;
    const unit = isCelsius ? '°C' : '°F';
    weatherDiv.innerHTML = `
        <h2>${translations[lang].currentWeather}</h2>
        <p>${translations[lang].temperature}: ${displayTemp.toFixed(2)} ${unit}</p>
    `;
}

function updateForecastDisplay(){
    const forecastDiv = document.getElementById('forecast');
    const forecast = JSON.parse(forecastDiv.dataset.forecast || '[]');
    let forecastHTML = `<h2>${translations[lang].weeklyForecast}</h2>`;
    forecast.forEach((day,index) => {
        const maxTemp = isCelsius ? day.maxTemp : (day.maxTemp * 9/5) + 32;
        const minTemp = isCelsius ? day.minTemp : (day.minTemp * 9/5) + 32;
        const unit = isCelsius ? '°C' : '°F';
        forecastHTML += `
        <p>${translations[lang].temperature} Day ${index + 1}: Max: ${displayMaxTemp.toFixed(2)} ${unit}, Min: ${displayMinTemp.toFixed(2)} ${unit}</p>
        `;
    });
    forecastDiv.innerHTML = forecastHTML;
}

function updatePageLanguage() {
    const lang = isEnglish ? 'en' : 'es';
    document.getElementById('cityLabel').textContent = translations[lang].city;
    document.getElementById('stateLabel').textContent = translations[lang].state;
    document.getElementById('getWeather').textContent = translations[lang].getWeather;
    document.getElementById('getForecast').textContent = translations[lang].getForecast;
    document.getElementById('toggleUnits').textContent = translations[lang].toggleUnits;
    document.getElementById('translatePage').textContent = translations[lang].translatePage;
}
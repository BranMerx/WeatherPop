let isCelsius = true;
let isEnglish = true;

//Lists of each component that needs to be translated from English to Spanish and vice versa
const translations = {
    en: {
        cityPlaceHolder: "Enter city",
        statePlaceHolder: "Enter state",
        city: "City:",
        state: "State:",
        getWeather: "Get Weather",
        getForecast: "Get Forecast",
        unitsMeasure: "Change Units of Measurement",
        language: "English/Spanish",
        currentWeather: "Current Weather",
        getForecast:"Weekly Forecast"
    },
    es: {
        cityPlaceHolder: "Ingresa Ciudad",
        statePlaceHolder: "Ingresa Estado",
        city: "Ciudad:",
        state: "Estado:",
        getWeather: "Obtener el clima",
        getForecast: "Obtener el pronóstico",
        unitsMeasure: "Cambiar unidades",
        language:"Inglés/Español",
        currentWeather: "Clima actual",
        getForecast:"Pronóstico semenal"
    }

};


document.getElementById('getWeather').addEventListener('click', function(){  // Event listener when Get Weather button is pushed
   
    const city = document.getElementById('cityLabel').value;
    const state = document.getElementById('stateLabel').value;
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
    const city = document.getElementById('cityLabel').value;
    const state = document.getElementById('stateLabel').value;
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

document.getElementById('unitsMeasure').addEventListener('click', function(){ //Function that is used when change units from F to C and vice versa bbutton is pushed. 
    isCelsius = !isCelsius;

    const weatherDiv = document.getElementById('weather');
    const forecastDiv = document.getElementById('forecast');

    if(weatherDiv.dataset.temperature){
        updateWeatherDisplay();
    }

    if(forecastDiv.dataset.temperature){
        updateForecastDisplay();
    }
});

document.getElementById('language').addEventListener('click', function(){ // Function that is used when the translation button is pushed. 
    isEnglish = !isEnglish;
    updatePageLanguage();
});

function fetchWeather(lat, lng) { // Function to return value for get current weather for the given city and state.
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`;
    fetch(weatherUrl)
    fetch(weatherUrl)
    .then(response => response.json())
    .then(data => {
        document.getElementById('forecast').innerHTML ='';
        document.getElementById('weather').innerHTML = 'Weather Today: ';
        const weatherDiv = document.getElementById('weather');
        const currentWeather = data.current_weather.temperature;
        weatherDiv.dataset.temperature = currentWeather;
        updateWeatherDisplay();
    })
    .catch(error => {
        console.error('Error fetching weather data:', error);
        document.getElementById('weather').innerHTML = 'Error fetching weather data. Please try again.';
    });
}

function fetchForecast(lat, lng) { // Function to return the forecast for the given city and state.
    const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min`;
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            document.getElementById('weather').innerHTML = '';
            document.getElementById('forecast').innerHTML ='Forecast for the Week:';
            const forecastDiv = document.getElementById('forecast');
            const forecast = data.daily.temperature_2m_max.map((maxTemp, index) => ({
                maxTemp,
                minTemp: data.daily.temperature_2m_min[index]
            }));
            document.getElementById('forecast').dataset.forecast = JSON.stringify(forecast);
            forecastDiv.dataset.temperature = forecast;//added based upon previous function
            updateForecastDisplay();
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
            document.getElementById('forecast').innerHTML = 'Error fetching forecast data. Please try again.';
        });
}

function updateWeatherDisplay(){ //Will update the actual display based upon what is requseted. 
    const lang = isEnglish ? 'en' : 'es';
    const weatherDiv = document.getElementById('weather');
    const temperature = parseFloat(weatherDiv.dataset.temperature);
    const displayTemp = isCelsius ? temperature : (temperature * 9/5) + 32;
    const unit = isCelsius ? '°C' : '°F';
    weatherDiv.innerHTML = `
        <h2>${translations[lang].currentWeather}</h2>
        <p> Today's Temperature: ${displayTemp.toFixed(2)} ${unit}</p>
    `;
}

function updateForecastDisplay(){ //Updates the forecast display
    const lang = isEnglish ? 'en' : 'es';
    const forecastDiv = document.getElementById('forecast');
    const forecast = JSON.parse(forecastDiv.dataset.forecast || '[]');
    let forecastHTML = `<h2>${translations[lang].getForecast}</h2>`;
    forecast.forEach((day,index) => {
        const maxTemp = isCelsius ? day.maxTemp : (day.maxTemp * 9/5) + 32;
        const minTemp = isCelsius ? day.minTemp : (day.minTemp * 9/5) + 32;
        const unit = isCelsius ? '°C' : '°F';
        forecastHTML += `
        <p> Day ${index + 1}: Max: ${maxTemp.toFixed(2)} ${unit}, Min: ${minTemp.toFixed(2)} ${unit}</p>
        `;
    });
    forecastDiv.innerHTML = forecastHTML;
}

function updatePageLanguage() { //updates the language with what is requested in the actual buttons and text dialogues. 
    const lang = isEnglish ? 'en' : 'es';
    document.getElementById('cityLabel').textContent = translations[lang].city;
    document.getElementById('stateLabel').textContent = translations[lang].state;
    document.getElementById('getWeather').textContent = translations[lang].getWeather;
    document.getElementById('getForecast').textContent = translations[lang].getForecast;
    document.getElementById('unitsMeasure').textContent = translations[lang].unitsMeasure;
    document.getElementById('language').textContent = translations[lang].language;

    //Updating placeholders for city and state input fields
    document.getElementById('cityLabel').setAttribute('placeholder', translations[lang].cityPlaceHolder);
    document.getElementById('stateLabel').setAttribute('placeholder', translations[lang].statePlaceHolder);
}
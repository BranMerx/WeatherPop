document.getElementById('getWeather').addEventListener('click', function(){
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const apiKey = 'b2af4ce301674059b88135b7ea8aa42a';
    const geocodeUrl ='`https://api.opencagedata.com/geocode/v1/json?q=${city},${state}&key=${apiKey}';

    fetch(geocodeUrl)
    .then(response => response.json())
    .then(data => {
        if (data.results.length > 0) {
            const { lat, lng } = data.results[0].geometry;
            return fetchWeather(lat, lng);
        } else {
            throw new Error('Location not found');
        }
    })
    .catch(error => {
        console.error('Error fetching geocoding data:', error);
        document.getElementById('weather').innerHTML = 'Error fetching location data. Please try again.';
    });
});

function fetchWeather(lat, lng){
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=temperature_2m`;
    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            const weatherDiv = document.getElementById('weather');
            const currentWeather = data.hourly.temperature_2m[0];
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

/*document.getElementById('getWeather').addEventListener('click', function() {
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const weatherDiv = document.getElementById('weather');
            const temperature = data.hourly.temperature_2m[0]; // Get the first hour's temperature
            weatherDiv.innerHTML = `
                <h2>Weather</h2>
                <p>Temperature: ${temperature} °C</p>
            `;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
});*/

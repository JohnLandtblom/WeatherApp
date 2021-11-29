let userInputLocation  = document.getElementById('userInput');
let dateInput          = document.getElementById('date');
let headLineText       = document.getElementById('headLine');
let btn                = document.getElementById('submitBtn');
let btnRemove          = document.getElementById('removeBtn');
let result             = document.getElementById('weatherData');
let displayContent     = document.getElementById('contentDisplay');

btn.addEventListener('click', function(e) {
    e.preventDefault();
    fetchWoeId();
    displayContent.style ="";
})

btnRemove.addEventListener('click', function() {
    displayContent.remove();
})

async function fetchWeatherData(woeId) {
    result.innerHTML = '';
    let dateSpecificWeather = false;
    let dateValue = dateInput.value;
    let getUrl = 'https://www.metaweather.com/api/location/' + woeId;
    if(dateValue && dateValue.length > 0)
    {
        dateSpecificWeather = true;
        getUrl += "/" + dateValue.replaceAll('-', '/');
    }
    try {
        let response = await fetch(getUrl);
       
        if (!response.ok) {
            throw new Error(`<h2>Something went wrong.. ${error}</h2>`);
        }
        let data = await response.json();

      if(dateSpecificWeather) {
            headLineText.innerHTML = `<h1>The Weather In ${userInputLocation.value} On The ${dateInput.value} was:</h1>`;
            for (let i = 0; i < data.length; i++) {
                let weather = data[i];
                let weatherIcon = weather.weather_state_abbr;
                let rounded = Math.round(weather.the_temp * 10) / 10;
                let img = `https://www.metaweather.com/static/img/weather/png/64/${weatherIcon}.png`;
                
                result.innerHTML = `
                <li>
                <h2>${dateInput.value}</h2>
                <p>${weather.weather_state_name}</p>
                <img src="${img}"><br>
                <a>Temperature: ${rounded} °C</a>
                </li>
                `;
            }
            
        } else {    
            let weatherColl = data.consolidated_weather;
            console.log(data);
            headLineText.innerHTML = `<h1>The Weather In ${data.title}</h1>`;
        for (let i= 0; i < weatherColl.length; i++) {
            let weather = weatherColl[i];
            let weatherIcon = weather.weather_state_abbr;
            let rounded = Math.round(weather.the_temp * 10) / 10;
            let img = `https://www.metaweather.com/static/img/weather/png/64/${weatherIcon}.png`

            result.innerHTML += `
                <li>
                <h2>${weather.applicable_date}</h2>
                <p>${weather.weather_state_name}</p>
                <img src="${img}"><br>
                <a>Temperature: ${rounded} °C</a>
                </li>
                `;
        }
      }
    } catch(error) {
        console.log(error);
        result.innerHTML = `<h2>OOOPS! Something went wrong. "${error}"</h2>`;
    }
}

async function fetchWoeId() {
    try {
        let response = await fetch('https://www.metaweather.com/api/location/search/?query=' + userInputLocation.value);
        if (!response.ok) {
            throw new Error(`<h2>Something went wrong.. ${error}</h2>`);
        }

        let data = await response.json();
        if(data && data.length > 0)
        {
            let cityData = data[0];
            fetchWeatherData(cityData.woeid);
        }

    } catch(error) {
        console.log(error);
        result.innerHTML = `<h2>OOOPS! Something went wrong. "${error}"</h2>`;
    }
}


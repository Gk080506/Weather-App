const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const errorMessage = document.getElementById('error-message');
const weatherData = document.getElementById('weather-data');
const loading = document.getElementById('loading');

const cityName = document.getElementById('city-name');
const dateElement = document.getElementById('date');
const temp = document.getElementById('temp');
const weatherImg = document.getElementById('weather-img');
const weatherDesc = document.getElementById('weather-desc');
const feelsLike = document.getElementById('feels-like');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const pressure = document.getElementById('pressure');

const API_KEY = '12796c0dcd213a9605f1712ca654a8d0';

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            getWeatherData(city);
        }
    }
});

async function getWeatherData(city) {
    showLoading();
    hideError();
    hideWeatherData();

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('City not found. Please check the spelling and try again.');
            } else if (response.status === 401) {
                throw new Error('API key is invalid. Please check your API key.');
            } else {
                throw new Error('Something went wrong. Please try again later.');
            }
        }

        const data = await response.json();
        displayWeatherData(data);
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

function displayWeatherData(data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    
    const currentDate = new Date();
    dateElement.textContent = currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    temp.textContent = `${Math.round(data.main.temp)}°C`;
    
    const iconCode = data.weather[0].icon;
    weatherImg.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherImg.alt = data.weather[0].description;
    
    weatherDesc.textContent = data.weather[0].description;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${data.wind.speed} m/s`;
    pressure.textContent = `${data.main.pressure} hPa`;

    weatherData.classList.remove('hidden');
}

function showLoading() {
    loading.classList.remove('hidden');
}

function hideLoading() {
    loading.classList.add('hidden');
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}

function hideWeatherData() {
    weatherData.classList.add('hidden');
}


const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const errorBox = document.getElementById('errorBox');
const forecastList = document.getElementById('forecastList');

const weatherCodeMap = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  61: 'Rain',
  63: 'Heavy rain',
  71: 'Snow',
  80: 'Showers',
  95: 'Thunderstorm',
};

const mockData = {
  city: 'Delhi',
  temp: 32,
  feelsLike: 34,
  humidity: 44,
  wind: 12,
  condition: 'Sunny',
  icon: '☀️',
  forecast: [
    { day: 'Mon', icon: '☀️', temp: '34°' },
    { day: 'Tue', icon: '⛅', temp: '33°' },
    { day: 'Wed', icon: '🌧️', temp: '29°' },
    { day: 'Thu', icon: '⛈️', temp: '31°' },
    { day: 'Fri', icon: '☀️', temp: '35°' }
  ]
};

function showError(message) {
  errorBox.textContent = message;
  errorBox.classList.remove('hidden');
}

function hideError() {
  errorBox.classList.add('hidden');
}

function renderForecast(items) {
  forecastList.innerHTML = items.map(item => `
    <div class="forecast-item">
      <div class="forecast-left">
        <span class="forecast-icon">${item.icon}</span>
        <span class="forecast-day">${item.day}</span>
      </div>
      <div class="forecast-temp">${item.temp}</div>
    </div>
  `).join('');
}

function updateUI(data) {
  document.getElementById('cityName').textContent = data.city;
  document.getElementById('currentTemp').textContent = `${Math.round(data.temp)}°`;
  document.getElementById('weatherText').textContent = data.condition;
  document.getElementById('feelsLike').textContent = `${Math.round(data.feelsLike)}°`;
  document.getElementById('humidity').textContent = `${data.humidity}%`;
  document.getElementById('windSpeed').textContent = `${data.wind} km/h`;
  document.getElementById('weatherIcon').textContent = data.icon;
  renderForecast(data.forecast);
}

async function fetchWeather(city) {
  hideError();

  try {
    const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
    const data = await response.json();

    if (!response.ok) {
      updateUI({ ...mockData, city });
      showError(data.error || 'Could not load live data. Showing demo interface.');
      return;
    }

    const current = data.current;
    const code = current.weather_code;
    const condition = weatherCodeMap[code] || 'Weather';
    const icon = code === 0 || code === 1 ? '☀️' : code >= 2 && code <= 3 ? '⛅' : code >= 51 ? '🌧️' : '🌤️';

    updateUI({
      city: data.city.name,
      temp: current.temperature_2m,
      feelsLike: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      wind: current.wind_speed_10m,
      condition,
      icon,
      forecast: data.daily.time.slice(0, 5).map((date, index) => ({
        day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        icon: index % 2 === 0 ? '☀️' : '🌧️',
        temp: `${Math.round(data.daily.temperature_2m_max[index])}°`
      }))
    });
  } catch (error) {
    updateUI({ ...mockData, city });
    showError('Live weather is unavailable. Showing demo interface.');
  }
}

searchBtn.addEventListener('click', () => {
  const value = cityInput.value.trim();
  if (!value) {
    showError('Please enter a city name');
    return;
  }
  fetchWeather(value);
});

cityInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const value = cityInput.value.trim();
    if (value) {
      fetchWeather(value);
    }
  }
});

updateUI(mockData);

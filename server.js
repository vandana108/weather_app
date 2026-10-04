const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/weather', async (req, res) => {
  const city = (req.query.city || '').trim();

  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  try {
    const geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
    );

    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      return res.status(404).json({ error: 'City not found' });
    }

    const location = geoData.results[0];
    const { latitude, longitude, name, country, timezone } = location;

    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m&timezone=auto&forecast_days=5`
    );

    const weatherData = await weatherResponse.json();

    return res.json({
      city: {
        name,
        country,
        timezone,
      },
      location: {
        latitude,
        longitude,
      },
      current: weatherData.current,
      daily: weatherData.daily,
      hourly: weatherData.hourly,
    });
  } catch (error) {
    console.error('Weather API error:', error);
    return res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

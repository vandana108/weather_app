# Weather API Project

This is a small weather app built with Node.js and Express. It uses the free Open-Meteo API, which does not require an API key. That makes it safe to push to GitHub and easy to show in interviews.

## Why this design is useful

- No secret API key is needed.
- No paid subscription is required.
- It works well for a portfolio project.
- It demonstrates frontend + backend integration.

## Project structure

- `server.js` - Express backend
- `public/index.html` - UI page
- `public/style.css` - styling
- `public/script.js` - frontend logic

## Run locally

```bash
npm install
npm start
```

Then open:

```text
http://localhost:3000
```

## API used

The project calls Open-Meteo public endpoints:

- Geocoding API to find a city
- Forecast API to get weather data

These endpoints are free to use without an API key.

## Important note for GitHub

Do not push any real API keys to GitHub. If an API requires a key, use a free public service like Open-Meteo or move the key to a server-side environment variable that is not committed.

## Example

If you search for `Delhi`, the app will return the current weather and a 5-day forecast.

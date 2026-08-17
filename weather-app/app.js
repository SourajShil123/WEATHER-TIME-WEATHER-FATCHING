const API_KEY = "ecb668e3fe99ee306081e435c01475f2";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const CITIES = ["Mumbai", "Kolkata", "Bangalore", "Delhi"];

async function fetchWeather(city) {
  const res = await fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`);
  if (!res.ok) throw new Error();
  return res.json();
}

function createCard(data) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <h2>${data.name}</h2>
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="icon" />
    <p class="temp">${Math.round(data.main.temp)}°C</p>
    <p class="desc">${data.weather[0].description}</p>
    <hr class="divider" />
    <p class="meta">💧 Humidity: ${data.main.humidity}%</p>
    <p class="meta">💨 Wind: ${data.wind.speed} m/s</p>
    <p class="meta">🌡 Feels like: ${Math.round(data.main.feels_like)}°C</p>
  `;
  return card;
}

async function loadAll() {
  const grid = document.getElementById("grid");
  for (const city of CITIES) {
    try {
      const data = await fetchWeather(city);
      grid.appendChild(createCard(data));
    } catch {
      const err = document.createElement("div");
      err.className = "error-card";
      err.innerHTML = `<div style="font-size:1.8rem">⚠️</div><p>Failed to load<br><strong>${city}</strong></p>`;
      grid.appendChild(err);
    }
  }
}

async function searchCity() {
  const input = document.getElementById("searchInput");
  const city = input.value.trim();
  if (!city) return;
  const grid = document.getElementById("grid");
  try {
    const data = await fetchWeather(city);
    if (data.sys.country !== "IN") {
      alert("Please search an Indian city only.");
      return;
    }
    grid.prepend(createCard(data));
    input.value = "";
  } catch {
    alert(`Could not find weather for "${city}".`);
  }
}

document.getElementById("searchInput").addEventListener("keydown", e => {
  if (e.key === "Enter") searchCity();
});

loadAll();

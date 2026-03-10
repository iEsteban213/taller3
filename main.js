/* ================================================
   API Lab — Programación Web 2
   Archivo: main.js
   ================================================ */


/* ============================================
   CURSOR GLOW EFFECT
   ============================================ */
const cursorGlow = document.getElementById('cursor-glow');
document.addEventListener('mousemove', e => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top  = e.clientY + 'px';
});


/* ============================================
   NAVEGACIÓN — TABS
   ============================================ */
function switchTab(idx) {
  document.querySelectorAll('.panel').forEach((panel, i) => {
    panel.classList.toggle('active', i === idx);
  });
  document.querySelectorAll('.tab').forEach((tab, i) => {
    tab.classList.toggle('active', i === idx);
  });
}


/* ============================================
   EJERCICIO 1 — GALERÍA DE IMÁGENES
   API: https://jsonplaceholder.typicode.com/photos
   Imágenes reales: https://picsum.photos
   ============================================ */
async function loadGallery(limit = 10) {
  const grid   = document.getElementById('gallery-grid');
  const loader = document.getElementById('gallery-loader');
  const error  = document.getElementById('gallery-error');
  const count  = document.getElementById('gallery-count');

  grid.innerHTML = '';
  loader.classList.add('show');
  error.classList.remove('show');
  count.textContent = '';

  try {
    const url      = `https://jsonplaceholder.typicode.com/photos?_limit=${limit}`;
    const response = await fetch(url);

    if (!response.ok) throw new Error('No se pudieron cargar las fotos');

    const photos = await response.json();

    loader.classList.remove('show');
    count.textContent = `${photos.length} imágenes`;

    photos.forEach((photo, i) => {
      const card = document.createElement('div');
      card.className = 'photo-card';
      card.style.animationDelay = `${i * 0.04}s`;

      const imgUrl = `https://picsum.photos/seed/${photo.id}/300/300`;

      card.innerHTML = `
        <img src="${imgUrl}" alt="${photo.title}" loading="lazy">
        <div class="photo-info">
          <div class="photo-title">${photo.title}</div>
          <div class="photo-id">#${photo.id} · Álbum ${photo.albumId}</div>
        </div>
      `;
      grid.appendChild(card);
    });

  } catch (err) {
    loader.classList.remove('show');
    error.textContent = `Error: ${err.message}`;
    error.classList.add('show');
  }
}


/* ============================================
   EJERCICIO 2 — APP DEL CLIMA + PRONÓSTICO 3 DÍAS
   API: https://wttr.in (pública, sin key)
   ============================================ */

const WEATHER_ICONS = {
  'sunny':         '☀️',
  'clear':         '🌙',
  'partly cloudy': '⛅',
  'cloudy':        '☁️',
  'overcast':      '🌥️',
  'mist':          '🌫️',
  'fog':           '🌁',
  'rain':          '🌧️',
  'drizzle':       '🌦️',
  'snow':          '❄️',
  'sleet':         '🌨️',
  'thunder':       '⛈️',
  'blizzard':      '🌨️',
  'freezing':      '🥶',
};

function weatherIcon(desc) {
  const d = desc.toLowerCase();
  for (const [key, icon] of Object.entries(WEATHER_ICONS)) {
    if (d.includes(key)) return icon;
  }
  return '🌡️';
}

function formatDay(dateStr) {
  const y = dateStr.slice(0, 4);
  const m = dateStr.slice(4, 6);
  const d = dateStr.slice(6, 8);
  const date = new Date(`${y}-${m}-${d}`);
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    day:     'numeric',
    month:   'short',
  });
}

async function searchWeather() {
  const city = document.getElementById('city-input').value.trim();
  if (!city) return;

  const card     = document.getElementById('weather-card');
  const loader   = document.getElementById('weather-loader');
  const error    = document.getElementById('weather-error');
  const btn      = document.getElementById('weather-btn');
  const forecast = document.getElementById('forecast-section');

  card.classList.remove('show');
  forecast.classList.remove('show');
  loader.classList.add('show');
  error.classList.remove('show');
  btn.disabled = true;

  try {
    const response = await fetch(
      `https://wttr.in/${encodeURIComponent(city)}?format=j1`
    );

    if (!response.ok) throw new Error('Ciudad no encontrada');

    const data    = await response.json();
    const current = data.current_condition[0];
    const area    = data.nearest_area[0];

    // Clima actual
    document.getElementById('w-city').textContent       = area.areaName[0].value;
    document.getElementById('w-country').textContent    = area.country[0].value;
    document.getElementById('w-temp').textContent       = `${current.temp_C}°`;
    document.getElementById('w-desc').textContent       = current.weatherDesc[0].value;
    document.getElementById('w-feels').textContent      = `${current.FeelsLikeC}°C`;
    document.getElementById('w-humidity').textContent   = `${current.humidity}%`;
    document.getElementById('w-wind').textContent       = `${current.windspeedKmph} km/h`;
    document.getElementById('w-visibility').textContent = `${current.visibility} km`;

    loader.classList.remove('show');
    card.classList.add('show');

    // Pronóstico 3 días
    renderForecast(data.weather);

  } catch (err) {
    loader.classList.remove('show');
    error.textContent = `⚠ No se encontró "${city}". Intenta con otro nombre.`;
    error.classList.add('show');
  }

  btn.disabled = false;
}

function renderForecast(days) {
  const grid    = document.getElementById('forecast-grid');
  const section = document.getElementById('forecast-section');

  grid.innerHTML = '';

  days.forEach((day, i) => {
    const desc    = day.hourly[4]?.weatherDesc[0]?.value || '—';
    const icon    = weatherIcon(desc);
    const dateStr = formatDay(day.date);
    const maxC    = day.maxtempC;
    const minC    = day.mintempC;
    const rain    = day.hourly.reduce((acc, h) => acc + Number(h.chanceofrain), 0) / day.hourly.length;
    const avgWind = day.hourly.reduce((acc, h) => acc + Number(h.windspeedKmph), 0) / day.hourly.length;
    const avgHum  = day.hourly.reduce((acc, h) => acc + Number(h.humidity), 0) / day.hourly.length;

    const card = document.createElement('div');
    card.className = 'forecast-card';
    card.style.animationDelay = `${i * 0.1}s`;
    card.innerHTML = `
      <div class="fc-date">${dateStr}</div>
      <span class="fc-icon">${icon}</span>
      <div class="fc-desc">${desc}</div>
      <div class="fc-temps">
        <span class="fc-max">${maxC}°</span>
        <span class="fc-min">${minC}°</span>
      </div>
      <div class="fc-stats">
        <div class="fc-stat-row">
          <span class="fc-stat-key">Lluvia</span>
          <span class="fc-stat-val">${Math.round(rain)}%</span>
        </div>
        <div class="fc-stat-row">
          <span class="fc-stat-key">Viento</span>
          <span class="fc-stat-val">${Math.round(avgWind)} km/h</span>
        </div>
        <div class="fc-stat-row">
          <span class="fc-stat-key">Humedad</span>
          <span class="fc-stat-val">${Math.round(avgHum)}%</span>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  section.classList.add('show');
}


/* ============================================
   INICIALIZACIÓN
   ============================================ */
loadGallery(10);

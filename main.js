/* ================================================
   Taller de Consumo de APIs JS — Programación Web 2
   Archivo: main.js
   ================================================ */


/* ============================================
   NAVEGACIÓN — TABS
   ============================================ */

/**
 * Cambia el panel activo según el índice del tab.
 * @param {number} idx - Índice del tab seleccionado (0, 1 o 2)
 */
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
   ============================================ */

/**
 * Carga fotografías desde la API JSONPlaceholder y las renderiza en el grid.
 * Utiliza fetch + async/await y manejo de errores con try/catch.
 * @param {number} limit - Cantidad de fotos a cargar (por defecto 10)
 */
async function loadGallery(limit = 10) {
  const grid   = document.getElementById('gallery-grid');
  const loader = document.getElementById('gallery-loader');
  const error  = document.getElementById('gallery-error');
  const count  = document.getElementById('gallery-count');

  // Limpiar estado anterior
  grid.innerHTML = '';
  loader.classList.add('show');
  error.classList.remove('show');
  count.textContent = '';

  try {
    // Petición a la API con fetch
    const url      = `https://jsonplaceholder.typicode.com/photos?_limit=${limit}`;
    const response = await fetch(url);

    // Validar respuesta HTTP
    if (!response.ok) throw new Error('No se pudieron cargar las fotos');

    // Convertir respuesta a JSON
    const photos = await response.json();

    loader.classList.remove('show');
    count.textContent = `${photos.length} fotos cargadas`;

    // Renderizar cada foto como tarjeta
    photos.forEach((photo, i) => {
      const card = document.createElement('div');
      card.className = 'photo-card';
      card.style.animationDelay = `${i * 0.05}s`;
      card.innerHTML = `
        <img src="${photo.thumbnailUrl}" alt="${photo.title}" loading="lazy">
        <div class="photo-info">
          <div class="photo-title">${photo.title}</div>
          <div class="photo-id">#${photo.id} · Album ${photo.albumId}</div>
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
   EJERCICIO 2 — APP DEL CLIMA
   API: https://wttr.in (pública, sin key)
   En producción: openweathermap.org/api
   ============================================ */

/**
 * Busca el clima actual de una ciudad usando la API wttr.in.
 * Es funcionalmente equivalente a OpenWeatherMap para practicar
 * fetch + async/await sin necesitar una API key.
 */
async function searchWeather() {
  const city = document.getElementById('city-input').value.trim();
  if (!city) return;

  const card   = document.getElementById('weather-card');
  const loader = document.getElementById('weather-loader');
  const error  = document.getElementById('weather-error');
  const btn    = document.getElementById('weather-btn');

  // Resetear UI
  card.classList.remove('show');
  loader.classList.add('show');
  error.classList.remove('show');
  btn.disabled = true;

  try {
    // Petición a la API de clima
    const response = await fetch(
      `https://wttr.in/${encodeURIComponent(city)}?format=j1`
    );

    if (!response.ok) throw new Error('Ciudad no encontrada');

    const data = await response.json();

    // Extraer datos relevantes
    const current = data.current_condition[0];
    const area    = data.nearest_area[0];

    // Actualizar el DOM con los datos del clima
    document.getElementById('w-city').textContent       = area.areaName[0].value;
    document.getElementById('w-country').textContent    = area.country[0].value;
    document.getElementById('w-temp').textContent       = `${current.temp_C}°C`;
    document.getElementById('w-desc').textContent       = current.weatherDesc[0].value;
    document.getElementById('w-feels').textContent      = `${current.FeelsLikeC}°C`;
    document.getElementById('w-humidity').textContent   = `${current.humidity}%`;
    document.getElementById('w-wind').textContent       = `${current.windspeedKmph} km/h`;
    document.getElementById('w-visibility').textContent = `${current.visibility} km`;

    loader.classList.remove('show');
    card.classList.add('show');

  } catch (err) {
    loader.classList.remove('show');
    error.textContent = `No se encontró "${city}". Intenta con otro nombre.`;
    error.classList.add('show');
  }

  btn.disabled = false;
}


/* ============================================
   EJERCICIO 3 — POKÉDEX
   API: https://pokeapi.co/api/v2/pokemon/{name}
   ============================================ */

// Nombres en español para las estadísticas base
const STAT_NAMES = {
  'hp':              'HP',
  'attack':          'Ataque',
  'defense':         'Defensa',
  'special-attack':  'Sp. Atk',
  'special-defense': 'Sp. Def',
  'speed':           'Velocidad',
};

/**
 * Busca un Pokémon por nombre o número en la PokéAPI
 * y muestra su información en pantalla.
 */
async function searchPoke() {
  const query = document.getElementById('poke-input').value.trim().toLowerCase();
  if (!query) return;

  const card   = document.getElementById('poke-card');
  const detail = document.getElementById('poke-detail');
  const loader = document.getElementById('poke-loader');
  const error  = document.getElementById('poke-error');
  const btn    = document.getElementById('poke-btn');

  // Resetear UI
  card.classList.remove('show');
  detail.classList.remove('show');
  loader.classList.add('show');
  error.classList.remove('show');
  btn.disabled = true;

  try {
    // Petición a la PokéAPI
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);

    if (!response.ok) throw new Error('Pokémon no encontrado');

    const data = await response.json();

    // --- Información básica ---
    document.getElementById('poke-name').textContent =
      data.name.charAt(0).toUpperCase() + data.name.slice(1);

    document.getElementById('poke-num').textContent =
      `#${String(data.id).padStart(4, '0')}`;

    document.getElementById('poke-img').src =
      data.sprites.other['official-artwork'].front_default ||
      data.sprites.front_default;

    document.getElementById('poke-height').textContent = `${data.height / 10} m`;
    document.getElementById('poke-weight').textContent = `${data.weight / 10} kg`;
    document.getElementById('poke-exp').textContent    = data.base_experience || '—';
    document.getElementById('poke-moves').textContent  = data.moves.length;

    // --- Tipos ---
    document.getElementById('poke-types').innerHTML = data.types
      .map(t => `<span class="type-badge type-${t.type.name}">${t.type.name}</span>`)
      .join('');

    // --- Habilidades ---
    document.getElementById('poke-abilities').innerHTML = data.abilities
      .map(a => `<span class="ability-tag">${a.ability.name}${a.is_hidden ? ' ✦' : ''}</span>`)
      .join('');

    // --- Estadísticas base con barras ---
    document.getElementById('poke-base-stats').innerHTML = data.stats
      .map(s => `
        <div class="stat-bar-row">
          <div class="stat-bar-name">${STAT_NAMES[s.stat.name] || s.stat.name}</div>
          <div class="stat-bar-track">
            <div class="stat-bar-fill" style="width: ${Math.min(s.base_stat / 255 * 100, 100)}%"></div>
          </div>
          <div class="stat-bar-val">${s.base_stat}</div>
        </div>
      `)
      .join('');

    loader.classList.remove('show');
    card.classList.add('show');
    detail.classList.add('show');

  } catch (err) {
    loader.classList.remove('show');
    error.textContent = `"${query}" no existe. Prueba con: pikachu, bulbasaur, 25...`;
    error.classList.add('show');
  }

  btn.disabled = false;
}


/* ============================================
   INICIALIZACIÓN
   ============================================ */

// Cargar galería automáticamente al abrir la página
loadGallery(10);

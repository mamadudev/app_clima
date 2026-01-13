// ============================================================================
// APLICATIVO DE CLIMA - LÓGICA PRINCIPAL
// Baseado no design do DonnéesMondiales.com
// ============================================================================

// Elementos do DOM - Controles
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const unitRadios = document.querySelectorAll('input[name="units"]');

// Elementos do DOM - Estados
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const weatherInfo = document.getElementById('weatherInfo');

// Elementos do DOM - Localização
const cityName = document.getElementById('cityName');
const coordinates = document.getElementById('coordinates');
const lastUpdate = document.getElementById('lastUpdate');
const country = document.getElementById('country');
const region = document.getElementById('region');
const latitude = document.getElementById('latitude');
const longitude = document.getElementById('longitude');

// Elementos do DOM - Dados meteorológicos
const weatherIcon = document.getElementById('weatherIcon');
const temp = document.getElementById('temp');
const tempUnit = document.getElementById('tempUnit');
const description = document.getElementById('description');
const feelsLike = document.getElementById('feelsLike');
const feelsUnit = document.getElementById('feelsUnit');
const feelsLikeCard = document.getElementById('feelsLikeCard');
const feelsUnitCard = document.getElementById('feelsUnitCard');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const windUnit = document.getElementById('windUnit');
const weatherCode = document.getElementById('weatherCode');

function getSelectedUnits() {
    const selectedRadio = document.querySelector('input[name="units"]:checked');
    return selectedRadio ? selectedRadio.value : 'metric';
}

function getWeatherIcon(code) {
    // Mapeamento completo de códigos WMO para emojis
    const iconMap = {
        0: '\u2600\uFE0F',      // Sol - Céu limpo
        1: '\uD83C\uDF24\uFE0F', // Sol com nuvem pequena - Predominantemente limpo
        2: '\u26C5',             // Sol atrás de nuvem - Parcialmente nublado
        3: '\u2601\uFE0F',       // Nuvem - Nublado
        45: '\uD83C\uDF2B\uFE0F', // Névoa - Neblina
        48: '\uD83C\uDF2B\uFE0F', // Névoa - Neblina com geada
        51: '\uD83C\uDF26\uFE0F', // Sol atrás de nuvem com chuva - Garoa leve
        53: '\uD83C\uDF26\uFE0F', // Sol atrás de nuvem com chuva - Garoa moderada
        55: '\uD83C\uDF27\uFE0F', // Nuvem com chuva - Garoa intensa
        56: '\uD83C\uDF28\uFE0F', // Nuvem com neve - Garoa congelante leve
        57: '\uD83C\uDF28\uFE0F', // Nuvem com neve - Garoa congelante intensa
        61: '\uD83C\uDF27\uFE0F', // Nuvem com chuva - Chuva leve
        63: '\uD83C\uDF27\uFE0F', // Nuvem com chuva - Chuva moderada
        65: '\u26C8\uFE0F',       // Nuvem com raio - Chuva forte
        66: '\uD83C\uDF28\uFE0F', // Nuvem com neve - Chuva congelante leve
        67: '\uD83C\uDF28\uFE0F', // Nuvem com neve - Chuva congelante forte
        71: '\uD83C\uDF28\uFE0F', // Nuvem com neve - Neve leve
        73: '\u2744\uFE0F',       // Floco de neve - Neve moderada
        75: '\u2744\uFE0F',       // Floco de neve - Neve forte
        77: '\uD83C\uDF28\uFE0F', // Nuvem com neve - Grãos de neve
        80: '\uD83C\uDF26\uFE0F', // Sol atrás de nuvem com chuva - Pancadas leves
        81: '\uD83C\uDF27\uFE0F', // Nuvem com chuva - Pancadas moderadas
        82: '\u26C8\uFE0F',       // Nuvem com raio - Pancadas fortes
        85: '\uD83C\uDF28\uFE0F', // Nuvem com neve - Pancadas de neve leves
        86: '\u2744\uFE0F',       // Floco de neve - Pancadas de neve fortes
        95: '\u26C8\uFE0F',       // Nuvem com raio - Tempestade
        96: '\u26C8\uFE0F',       // Nuvem com raio - Tempestade com granizo leve
        99: '\u26C8\uFE0F'        // Nuvem com raio - Tempestade com granizo forte
    };

    // Retorna ícone correspondente ou sol com nuvem como padrão
    return iconMap[code] !== undefined ? iconMap[code] : '\uD83C\uDF24\uFE0F';
}

function formatDateTime(isoString) {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    }).format(date);
}

function formatCoordinates(lat, lon) {
    const latDir = lat >= 0 ? 'N' : 'S';
    const lonDir = lon >= 0 ? 'L' : 'O';
    return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lon).toFixed(4)}° ${lonDir}`;
}

function showError(message) {
    hideAllSections();
    error.querySelector('p').textContent = message;
    error.classList.remove('hidden');
}

function showLoading() {
    hideAllSections();
    loading.classList.remove('hidden');
}

function hideAllSections() {
    loading.classList.add('hidden');
    error.classList.add('hidden');
    weatherInfo.classList.add('hidden');
}

function displayWeather(data) {
    hideAllSections();
    const units = getSelectedUnits();
    const isImperial = units === 'imperial';
    const tempSymbol = isImperial ? '°F' : '°C';
    const windSymbol = isImperial ? 'mph' : 'km/h';

    cityName.textContent = `${data.location.name}, ${data.location.country}`;
    coordinates.textContent = formatCoordinates(data.location.latitude, data.location.longitude);
    lastUpdate.textContent = `Atualizado: ${formatDateTime(data.weather.timestamp)}`;
    country.textContent = data.location.country;
    region.textContent = data.location.admin1 || 'Não disponível';
    latitude.textContent = data.location.latitude.toFixed(4) + '°';
    longitude.textContent = data.location.longitude.toFixed(4) + '°';
    weatherIcon.textContent = getWeatherIcon(data.weather.weatherCode);
    temp.textContent = Math.round(data.weather.temperature);
    tempUnit.textContent = tempSymbol;
    description.textContent = data.weather.description;
    feelsLike.textContent = Math.round(data.weather.feelsLike);
    feelsUnit.textContent = tempSymbol;
    humidity.textContent = data.weather.humidity;
    windSpeed.textContent = Math.round(data.weather.windSpeed);
    windUnit.textContent = windSymbol;
    feelsLikeCard.textContent = Math.round(data.weather.feelsLike);
    feelsUnitCard.textContent = tempSymbol;
    weatherCode.textContent = data.weather.weatherCode;
    weatherInfo.classList.remove('hidden');
}

async function searchWeather(cityName) {
    if (!cityName.trim()) {
        showError('Por favor, digite o nome de uma cidade');
        return;
    }
    showLoading();
    try {
        const units = getSelectedUnits();
        const data = await getCompleteWeatherData(cityName, units);
        displayWeather(data);
    } catch (err) {
        showError(err.message);
    }
}

searchBtn.addEventListener('click', () => searchWeather(cityInput.value));
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchWeather(cityInput.value);
});
unitRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        if (!weatherInfo.classList.contains('hidden')) {
            searchWeather(cityInput.value);
        }
    });
});
cityInput.focus();

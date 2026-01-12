// Lógica principal da aplicação

// Elementos do DOM
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const weatherInfo = document.getElementById('weatherInfo');

// Elementos de exibição dos dados
const cityName = document.getElementById('cityName');
const temp = document.getElementById('temp');
const description = document.getElementById('description');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');

/**
 * Exibe mensagem de erro
 * @param {string} message - Mensagem de erro
 */
function showError(message) {
    hideAllSections();
    error.querySelector('p').textContent = message;
    error.classList.remove('hidden');
}

/**
 * Exibe loading
 */
function showLoading() {
    hideAllSections();
    loading.classList.remove('hidden');
}

/**
 * Esconde todas as seções (loading, error, weatherInfo)
 */
function hideAllSections() {
    loading.classList.add('hidden');
    error.classList.add('hidden');
    weatherInfo.classList.add('hidden');
}

/**
 * Exibe os dados meteorológicos na tela
 * @param {Object} city - Dados da cidade
 * @param {Object} weather - Dados meteorológicos
 */
function displayWeather(city, weather) {
    hideAllSections();
    
    // Atualiza os elementos com os dados
    cityName.textContent = `${city.name}, ${city.country}`;
    temp.textContent = Math.round(weather.temperature);
    description.textContent = getWeatherDescription(weather.weatherCode);
    feelsLike.textContent = Math.round(weather.feelsLike);
    humidity.textContent = weather.humidity;
    windSpeed.textContent = Math.round(weather.windSpeed);
    
    // Exibe a seção de informações
    weatherInfo.classList.remove('hidden');
}

/**
 * Busca e exibe dados meteorológicos para uma cidade
 * @param {string} cityName - Nome da cidade
 */
async function searchWeather(cityName) {
    if (!cityName.trim()) {
        showError('Por favor, digite o nome de uma cidade');
        return;
    }
    
    showLoading();
    
    try {
        // Busca coordenadas da cidade
        const city = await getCityCoordinates(cityName);
        
        // Busca dados meteorológicos
        const weather = await getWeatherData(city.latitude, city.longitude);
        
        // Exibe os dados
        displayWeather(city, weather);
        
    } catch (err) {
        showError(err.message);
    }
}

// Event Listeners
searchBtn.addEventListener('click', () => {
    searchWeather(cityInput.value);
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchWeather(cityInput.value);
    }
});

// Foco inicial no input
cityInput.focus();

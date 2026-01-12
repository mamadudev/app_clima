// Funções para comunicação com as APIs

/**
 * Busca as coordenadas de uma cidade usando a API de Geocoding do Open-Meteo
 * @param {string} cityName - Nome da cidade
 * @returns {Promise<Object>} - Coordenadas da cidade (latitude, longitude, nome)
 */
async function getCityCoordinates(cityName) {
    const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=pt&format=json`;
    
    try {
        const response = await fetch(geocodingUrl);
        const data = await response.json();
        
        if (!data.results || data.results.length === 0) {
            throw new Error('Cidade não encontrada');
        }
        
        const result = data.results[0];
        return {
            name: result.name,
            country: result.country,
            latitude: result.latitude,
            longitude: result.longitude
        };
    } catch (error) {
        throw new Error('Erro ao buscar coordenadas da cidade: ' + error.message);
    }
}

/**
 * Busca dados meteorológicos usando a API Open-Meteo
 * @param {number} latitude - Latitude da cidade
 * @param {number} longitude - Longitude da cidade
 * @returns {Promise<Object>} - Dados meteorológicos
 */
async function getWeatherData(latitude, longitude) {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;
    
    try {
        const response = await fetch(weatherUrl);
        const data = await response.json();
        
        if (!data.current) {
            throw new Error('Dados meteorológicos não disponíveis');
        }
        
        return {
            temperature: data.current.temperature_2m,
            feelsLike: data.current.apparent_temperature,
            humidity: data.current.relative_humidity_2m,
            windSpeed: data.current.wind_speed_10m,
            weatherCode: data.current.weather_code
        };
    } catch (error) {
        throw new Error('Erro ao buscar dados meteorológicos: ' + error.message);
    }
}

/**
 * Converte código do tempo em descrição textual
 * @param {number} code - Código do tempo da API Open-Meteo
 * @returns {string} - Descrição do tempo
 */
function getWeatherDescription(code) {
    const weatherCodes = {
        0: 'Céu limpo',
        1: 'Predominantemente limpo',
        2: 'Parcialmente nublado',
        3: 'Nublado',
        45: 'Neblina',
        48: 'Neblina com geada',
        51: 'Garoa leve',
        53: 'Garoa moderada',
        55: 'Garoa intensa',
        61: 'Chuva leve',
        63: 'Chuva moderada',
        65: 'Chuva forte',
        71: 'Neve leve',
        73: 'Neve moderada',
        75: 'Neve forte',
        77: 'Granizo',
        80: 'Pancadas de chuva leves',
        81: 'Pancadas de chuva moderadas',
        82: 'Pancadas de chuva fortes',
        85: 'Pancadas de neve leves',
        86: 'Pancadas de neve fortes',
        95: 'Tempestade',
        96: 'Tempestade com granizo leve',
        99: 'Tempestade com granizo forte'
    };
    
    return weatherCodes[code] || 'Condição desconhecida';
}

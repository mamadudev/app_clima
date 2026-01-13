// ============================================================================
// API CLIENT PARA OPEN-METEO
// Funções para comunicação com as APIs de Geocodificação e Dados Meteorológicos
// Documentação: https://open-meteo.com/en/docs
// ============================================================================

/**
 * Valida o nome da cidade fornecido pelo usuário
 * @param {string} cityName - Nome da cidade a ser validado
 * @throws {Error} Se o nome da cidade for inválido
 */
function validateCityName(cityName) {
    if (!cityName || typeof cityName !== 'string') {
        throw new Error('Nome da cidade é obrigatório e deve ser uma string');
    }
    
    const trimmedName = cityName.trim();
    if (trimmedName.length === 0) {
        throw new Error('Nome da cidade não pode estar vazio');
    }
    
    if (trimmedName.length < 2) {
        throw new Error('Nome da cidade deve ter pelo menos 2 caracteres');
    }
    
    // Permite apenas letras, espaços, hífens e acentos
    const validPattern = /^[a-zA-ZÀ-ÿ\s\-]+$/;
    if (!validPattern.test(trimmedName)) {
        throw new Error('Nome da cidade contém caracteres inválidos');
    }
}

/**
 * Valida o sistema de unidades fornecido
 * @param {string} units - Sistema de unidades ('metric' ou 'imperial')
 * @throws {Error} Se o sistema de unidades for inválido
 */
function validateUnits(units) {
    const validUnits = ['metric', 'imperial'];
    if (!validUnits.includes(units)) {
        throw new Error(`Sistema de unidades inválido. Use 'metric' ou 'imperial'`);
    }
}

/**
 * Busca as coordenadas geográficas de uma cidade usando a API de Geocodificação do Open-Meteo
 * 
 * @param {string} cityName - Nome da cidade a ser buscada
 * @returns {Promise<Object>} Objeto contendo dados da localização
 * @returns {string} return.name - Nome da cidade encontrada
 * @returns {string} return.country - País da cidade
 * @returns {number} return.latitude - Latitude da cidade
 * @returns {number} return.longitude - Longitude da cidade
 * @returns {string} [return.admin1] - Região/Estado (quando disponível)
 * 
 * @throws {Error} Se a cidade não for encontrada
 * @throws {Error} Se houver erro de rede ou timeout
 * @throws {Error} Se a resposta da API for inválida
 * 
 * @example
 * const coords = await getCityCoordinates('São Paulo');
 * console.log(coords); // { name: 'São Paulo', country: 'Brasil', latitude: -23.5505, longitude: -46.6333 }
 */
async function getCityCoordinates(cityName) {
    // Valida entrada
    validateCityName(cityName);
    
    // URL da API de Geocodificação do Open-Meteo
    // Documentação: https://open-meteo.com/en/docs/geocoding-api
    const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName.trim())}&count=1&language=pt&format=json`;
    
    try {
        const response = await fetch(geocodingUrl);
        
        // Verifica se a resposta HTTP foi bem-sucedida
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Verifica se a API retornou resultados
        if (!data.results || data.results.length === 0) {
            throw new Error(`Cidade "${cityName}" não encontrada. Verifique a ortografia e tente novamente`);
        }
        
        const result = data.results[0];
        
        // Valida que os dados essenciais estão presentes
        if (typeof result.latitude !== 'number' || typeof result.longitude !== 'number') {
            throw new Error('Dados de coordenadas inválidos recebidos da API');
        }
        
        return {
            name: result.name,
            country: result.country || 'Desconhecido',
            latitude: result.latitude,
            longitude: result.longitude,
            admin1: result.admin1 // Estado/Região (opcional)
        };
        
    } catch (error) {
        // Trata erros específicos de rede
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Erro de conexão. Verifique sua internet e tente novamente');
        }
        
        // Trata timeout
        if (error.name === 'AbortError') {
            throw new Error('A requisição demorou muito. Tente novamente');
        }
        
        // Propaga o erro com contexto adicional
        throw new Error(`Erro ao buscar coordenadas: ${error.message}`);
    }
}

/**
 * Busca dados meteorológicos atuais usando a API Open-Meteo
 * 
 * @param {number} latitude - Latitude da localização (-90 a 90)
 * @param {number} longitude - Longitude da localização (-180 a 180)
 * @param {string} [units='metric'] - Sistema de unidades ('metric' ou 'imperial')
 * @returns {Promise<Object>} Objeto contendo dados meteorológicos atuais
 * @returns {number} return.temperature - Temperatura atual
 * @returns {number} return.feelsLike - Sensação térmica
 * @returns {number} return.humidity - Umidade relativa (0-100%)
 * @returns {number} return.windSpeed - Velocidade do vento
 * @returns {number} return.weatherCode - Código WMO do clima (0-99)
 * @returns {string} return.timestamp - Data/hora da medição (ISO 8601)
 * @returns {string} return.units - Sistema de unidades usado
 * 
 * @throws {Error} Se as coordenadas forem inválidas
 * @throws {Error} Se houver erro de rede
 * @throws {Error} Se a resposta da API for inválida
 * 
 * @example
 * const weather = await getWeatherData(-23.5505, -46.6333, 'metric');
 * console.log(`Temperatura: ${weather.temperature}°C`);
 */
async function getWeatherData(latitude, longitude, units = 'metric') {
    // Valida coordenadas
    if (typeof latitude !== 'number' || latitude < -90 || latitude > 90) {
        throw new Error('Latitude inválida. Deve estar entre -90 e 90');
    }
    
    if (typeof longitude !== 'number' || longitude < -180 || longitude > 180) {
        throw new Error('Longitude inválida. Deve estar entre -180 e 180');
    }
    
    // Valida sistema de unidades
    validateUnits(units);
    
    // Define parâmetros baseados no sistema de unidades
    const isImperial = units === 'imperial';
    const tempUnit = isImperial ? '&temperature_unit=fahrenheit' : '';
    const windUnit = isImperial ? '&wind_speed_unit=mph' : '';
    
    // URL da API de Previsão do Tempo do Open-Meteo
    // Documentação: https://open-meteo.com/en/docs
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto${tempUnit}${windUnit}`;
    
    try {
        const response = await fetch(weatherUrl);
        
        // Verifica se a resposta HTTP foi bem-sucedida
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Valida estrutura da resposta
        if (!data.current) {
            throw new Error('Dados meteorológicos não disponíveis no momento');
        }
        
        // Valida que todos os campos esperados estão presentes
        const current = data.current;
        if (typeof current.temperature_2m !== 'number') {
            throw new Error('Dados de temperatura inválidos');
        }
        
        return {
            temperature: current.temperature_2m,
            feelsLike: current.apparent_temperature,
            humidity: current.relative_humidity_2m,
            windSpeed: current.wind_speed_10m,
            weatherCode: current.weather_code,
            timestamp: current.time, // ISO 8601 format
            units: units
        };
        
    } catch (error) {
        // Trata erros específicos de rede
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Erro de conexão. Verifique sua internet e tente novamente');
        }
        
        // Trata timeout
        if (error.name === 'AbortError') {
            throw new Error('A requisição demorou muito. Tente novamente');
        }
        
        // Propaga o erro com contexto adicional
        throw new Error(`Erro ao buscar dados meteorológicos: ${error.message}`);
    }
}

/**
 * Converte código WMO (World Meteorological Organization) em descrição textual em português
 * 
 * Códigos WMO são padrões internacionais usados para descrever condições meteorológicas.
 * A API Open-Meteo utiliza estes códigos para representar o estado atual do tempo.
 * 
 * Referência: https://open-meteo.com/en/docs
 * WMO Code: https://www.nodc.noaa.gov/archive/arc0021/0002199/1.1/data/0-data/HTML/WMO-CODE/WMO4677.HTM
 * 
 * @param {number} code - Código WMO do tempo (0-99)
 * @returns {string} Descrição textual da condição meteorológica em português
 * 
 * @example
 * getWeatherDescription(0);  // Retorna: 'Céu limpo'
 * getWeatherDescription(61); // Retorna: 'Chuva leve'
 * getWeatherDescription(95); // Retorna: 'Tempestade'
 */
function getWeatherDescription(code) {
    // Mapeamento completo dos códigos WMO (0-99) para descrições em português
    const weatherCodes = {
        // Grupo 0: Céu limpo
        0: 'Céu limpo',
        
        // Grupo 1-3: Nuvens
        1: 'Predominantemente limpo',
        2: 'Parcialmente nublado',
        3: 'Nublado',
        
        // Grupo 45-48: Névoa/Neblina
        45: 'Neblina',
        48: 'Neblina com geada depositada',
        
        // Grupo 51-55: Garoa (Drizzle)
        51: 'Garoa leve',
        53: 'Garoa moderada',
        55: 'Garoa intensa',
        
        // Grupo 56-57: Garoa congelante
        56: 'Garoa congelante leve',
        57: 'Garoa congelante intensa',
        
        // Grupo 61-65: Chuva
        61: 'Chuva leve',
        63: 'Chuva moderada',
        65: 'Chuva forte',
        
        // Grupo 66-67: Chuva congelante
        66: 'Chuva congelante leve',
        67: 'Chuva congelante forte',
        
        // Grupo 71-75: Neve
        71: 'Neve leve',
        73: 'Neve moderada',
        75: 'Neve forte',
        
        // Grupo 77: Grãos de neve
        77: 'Grãos de neve',
        
        // Grupo 80-82: Pancadas de chuva
        80: 'Pancadas de chuva leves',
        81: 'Pancadas de chuva moderadas',
        82: 'Pancadas de chuva fortes',
        
        // Grupo 85-86: Pancadas de neve
        85: 'Pancadas de neve leves',
        86: 'Pancadas de neve fortes',
        
        // Grupo 95: Tempestade
        95: 'Tempestade',
        
        // Grupo 96-99: Tempestade com granizo
        96: 'Tempestade com granizo leve',
        99: 'Tempestade com granizo forte'
    };
    
    // Retorna a descrição correspondente ou mensagem padrão
    return weatherCodes[code] || `Condição desconhecida (código: ${code})`;
}

/**
 * Função principal: Busca dados meteorológicos completos de uma cidade
 * 
 * Esta função combina geocodificação e busca de dados meteorológicos em uma única chamada.
 * É a função recomendada para uso em aplicações, pois encapsula toda a lógica necessária.
 * 
 * @param {string} cityName - Nome da cidade a ser buscada
 * @param {string} [units='metric'] - Sistema de unidades ('metric' para Celsius/km/h ou 'imperial' para Fahrenheit/mph)
 * @returns {Promise<Object>} Objeto completo com dados da localização e clima
 * @returns {Object} return.location - Dados da localização
 * @returns {string} return.location.name - Nome da cidade
 * @returns {string} return.location.country - País
 * @returns {number} return.location.latitude - Latitude
 * @returns {number} return.location.longitude - Longitude
 * @returns {Object} return.weather - Dados meteorológicos
 * @returns {number} return.weather.temperature - Temperatura atual
 * @returns {number} return.weather.feelsLike - Sensação térmica
 * @returns {number} return.weather.humidity - Umidade relativa (%)
 * @returns {number} return.weather.windSpeed - Velocidade do vento
 * @returns {number} return.weather.weatherCode - Código WMO
 * @returns {string} return.weather.description - Descrição do clima
 * @returns {string} return.weather.timestamp - Data/hora da medição
 * @returns {string} return.weather.units - Sistema de unidades usado
 * 
 * @throws {Error} Se o nome da cidade for inválido
 * @throws {Error} Se a cidade não for encontrada
 * @throws {Error} Se houver erro ao buscar dados meteorológicos
 * @throws {Error} Se houver erro de conexão
 * 
 * @example
 * // Uso básico (métrico - padrão)
 * try {
 *   const data = await getCompleteWeatherData('São Paulo');
 *   console.log(`${data.location.name}: ${data.weather.temperature}°C`);
 *   console.log(`Condições: ${data.weather.description}`);
 * } catch (error) {
 *   console.error('Erro:', error.message);
 * }
 * 
 * @example
 * // Uso com sistema imperial
 * try {
 *   const data = await getCompleteWeatherData('New York', 'imperial');
 *   console.log(`${data.location.name}: ${data.weather.temperature}°F`);
 *   console.log(`Vento: ${data.weather.windSpeed} mph`);
 * } catch (error) {
 *   console.error('Erro:', error.message);
 * }
 */
async function getCompleteWeatherData(cityName, units = 'metric') {
    try {
        // Passo 1: Busca coordenadas da cidade
        const location = await getCityCoordinates(cityName);
        
        // Passo 2: Busca dados meteorológicos usando as coordenadas
        const weather = await getWeatherData(location.latitude, location.longitude, units);
        
        // Passo 3: Adiciona descrição textual do clima
        weather.description = getWeatherDescription(weather.weatherCode);
        
        // Retorna objeto completo estruturado
        return {
            location: {
                name: location.name,
                country: location.country,
                latitude: location.latitude,
                longitude: location.longitude,
                admin1: location.admin1
            },
            weather: weather
        };
        
    } catch (error) {
        // Propaga erro com contexto claro
        throw new Error(`Falha ao obter dados do clima: ${error.message}`);
    }
}

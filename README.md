# 🌤️ Aplicativo de Clima

Um aplicativo web simples e elegante para consultar a previsão do tempo de qualquer cidade do mundo.

## 🔗 Acesso Rápido

**🌐 [Acessar Aplicativo](https://mamadudev.github.io/app_clima/)**

## ✨ Funcionalidades

### 🌍 Dados Meteorológicos Completos

- **Busca inteligente** por nome da cidade com validação
- **Temperatura atual** com ícone dinâmico baseado no código WMO
- **Sensação térmica** calculada pela API
- **Umidade relativa do ar** (0-100%)
- **Velocidade do vento** com direção
- **Descrição detalhada** das condições climáticas em português
- **Coordenadas geográficas** (latitude/longitude) formatadas
- **Timestamp** de atualização dos dados

### ⚙️ Funcionalidades Avançadas

- **Seletor de unidades** - Métrico (°C/km/h) ou Imperial (°F/mph)
- **27 códigos WMO** mapeados com ícones emoji específicos
- **Geocodificação automática** via Open-Meteo
- **Tratamento robusto de erros** com mensagens específicas
- **Interface responsiva** - Mobile, tablet e desktop
- **Animações suaves** e transições elegantes
- **Validação de entrada** do usuário

### 🎨 Design Profissional

- Gradientes azuis inspirados em DonnéesMondiales.com
- Layout compacto e otimizado (sem espaços vazios)
- Cards informativos com hover effects
- Tipografia moderna e legível
- Paleta de cores profissional

## 🛠️ Tecnologias

- **HTML5** - Estrutura semântica da página
- **CSS3** - Estilização avançada com CSS Variables, Flexbox e Grid
- **JavaScript (ES6+)** - Lógica moderna com async/await
- **Open-Meteo API** - Dados meteorológicos gratuitos e precisos
  - API de Geocodificação
  - API de Previsão do Tempo

## 📁 Estrutura do Projeto
```
Projeto de Aplicativo de Clima/
├── index.html          # Página principal com estrutura completa
├── css/
│   └── style.css      # Estilos otimizados e responsivos
├── js/
│   ├── app.js         # Lógica principal e manipulação do DOM
│   └── api.js         # Funções de API com validação completa
├── assets/
│   └── icons/         # Pasta para ícones futuros
└── README.md          # Esta documentação
```

## 🚀 Como Usar

### Instalação

1. Clone o repositório ou baixe os arquivos
2. Abra o arquivo `index.html` em qualquer navegador moderno
3. Não é necessário instalar dependências!

### Uso Básico

1. Digite o nome de uma cidade no campo de busca (ex: "São Paulo", "Paris", "Tokyo")
2. Escolha o sistema de unidades (Métrico ou Imperial)
3. Clique em "🔍 Buscar" ou pressione Enter
4. Visualize as informações meteorológicas completas

### Funcionalidades

- **Troca de unidades**: Alterna entre °C/km/h e °F/mph automaticamente
- **Busca rápida**: Pressione Enter no campo de busca
- **Coordenadas**: Formato N/S e L/O para melhor compreensão
- **Código WMO**: Referência técnica do clima atual

## 🌐 APIs Utilizadas

### Open-Meteo API

Este projeto utiliza duas APIs do [Open-Meteo](https://open-meteo.com/):

1. **Geocoding API** - Conversão de nome de cidade em coordenadas

   - Endpoint: `https://geocoding-api.open-meteo.com/v1/search`
   - Retorna: nome, país, latitude, longitude, região

2. **Forecast API** - Dados meteorológicos atuais
   - Endpoint: `https://api.open-meteo.com/v1/forecast`
   - Retorna: temperatura, umidade, vento, código WMO, sensação térmica

**Vantagens:**

- ✅ Completamente gratuito
- ✅ Sem necessidade de chave de API
- ✅ Sem limite de requisições
- ✅ Alta precisão e confiabilidade
- ✅ Suporte a unidades métricas e imperiais
- ✅ Documentação completa

## 📊 Códigos WMO Suportados

O aplicativo mapeia todos os 27 códigos WMO padrão:

| Código | Descrição               | Emoji |
| ------ | ----------------------- | ----- |
| 0      | Céu limpo               | ☀️    |
| 1      | Predominantemente limpo | 🌤️    |
| 2      | Parcialmente nublado    | ⛅    |
| 3      | Nublado                 | ☁️    |
| 45, 48 | Neblina                 | 🌫️    |
| 51-55  | Garoa                   | 🌦️🌧️  |
| 56-57  | Garoa congelante        | 🌨️    |
| 61-65  | Chuva                   | 🌧️⛈️  |
| 66-67  | Chuva congelante        | 🌨️    |
| 71-77  | Neve                    | 🌨️❄️  |
| 80-82  | Pancadas de chuva       | 🌦️⛈️  |
| 85-86  | Pancadas de neve        | 🌨️❄️  |
| 95-99  | Tempestades             | ⛈️    |

## 🎯 Destaques Técnicos

### Código JavaScript

- **ES6+ Moderno**: Arrow functions, async/await, template literals
- **JSDoc Completo**: Documentação inline de todas as funções
- **Validação Robusta**: Entrada do usuário, coordenadas, unidades
- **Tratamento de Erros**: Mensagens específicas e user-friendly
- **Funções Reutilizáveis**: Código modular e manutenível

### CSS Otimizado

- **CSS Variables**: Paleta de cores centralizada
- **Flexbox & Grid**: Layout responsivo moderno
- **Animações**: Transições suaves e performáticas
- **Mobile First**: Design adaptável a todos os dispositivos
- **Layout Compacto**: Espaçamento eficiente sem desperdício

### Boas Práticas

- ✅ Código semântico e acessível
- ✅ Sem dependências externas
- ✅ Performance otimizada
- ✅ Compatível com navegadores modernos
- ✅ Código limpo e bem comentado

## 📱 Responsividade

O aplicativo é totalmente responsivo com 3 breakpoints:

- **Desktop** (> 768px): Layout completo com 2-4 colunas
- **Tablet** (480px - 768px): Layout adaptado com 1-2 colunas
- **Mobile** (< 480px): Layout vertical otimizado

## 🔧 Desenvolvimento

### Estrutura de Arquivos

**index.html**

- Estrutura HTML5 semântica
- Meta tags para SEO e responsividade
- Campos de entrada e seletores
- Seções para loading, erro e dados

**css/style.css**

- Design system com CSS Variables
- Layout compacto e profissional
- Animações e transições
- Media queries para responsividade

**js/api.js**

- `validateCityName()` - Valida entrada do usuário
- `validateUnits()` - Valida sistema de unidades
- `getCityCoordinates()` - Geocodificação
- `getWeatherData()` - Busca dados meteorológicos
- `getWeatherDescription()` - Traduz códigos WMO
- `getCompleteWeatherData()` - Função principal all-in-one

**js/app.js**

- `getSelectedUnits()` - Obtém unidade selecionada
- `getWeatherIcon()` - Mapeia código para emoji
- `formatDateTime()` - Formata timestamp
- `formatCoordinates()` - Formata lat/lon
- `displayWeather()` - Renderiza dados na UI
- `searchWeather()` - Orquestra busca completa

## 📝 Melhorias Futuras

- [ ] Previsão para 7 dias
- [ ] Gráfico de temperatura (Chart.js)
- [ ] Histórico de cidades pesquisadas (localStorage)
- [ ] Geolocalização automática (Geolocation API)
- [ ] Tema claro/escuro (toggle)
- [ ] PWA - Funcionar offline
- [ ] Compartilhamento de dados (Web Share API)
- [ ] Notificações de mudanças climáticas

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

- Reportar bugs
- Sugerir novas funcionalidades
- Melhorar a documentação
- Enviar pull requests

## 📄 Licença

Este projeto é de código aberto e está disponível para uso educacional e pessoal.

## 👨‍💻 Autor

**Mamadou Diagne**

Desenvolvido com ❤️ usando VS Code

---

**Última atualização:** Janeiro 2026  
**Versão:** 2.0.0

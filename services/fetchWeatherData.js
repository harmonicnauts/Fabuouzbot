var areaCode = require('../Data/loc_code.json')
// var areaCode = JSON.parse(jsonText)


// FORMATTED ASCII CARD
// +----------------------------------------------------------------------------------+
// |                           WEATHER FORECAST                                       |
// +----------------------------------------------------------------------------------+
// |                           Day-1                                                  |
// +----------------------------------------------------------------------------------+
// | 07:00 AM           | 10:00 AM          | 01:00 PM          | 04:00 PM            |
// +--------------------+----------------+----------------+----------------+----------+
// |🌥 Mostly Cloudy    | 🌥 Mostly Cloudy   | 🌥 Mostly Cloudy  | 🌧 Light Rain        |
// | Temp: 26°C         | Temp: 30°C        | Temp: 30°C        | Temp: 28°C          |
// | Wind: SW → NE      | Wind: SW → NE     | Wind: W → E       | Wind: SW → NE       |
// | 9.1 km/h           | 11.8 km/h         | 10 km/h           | 8.3 km/h            |
// | Humidity: 91%      | Humidity: 76%     | Humidity: 76%     | Humidity: 83%       |
// | Precip: 0 mm       | Precip: 0 mm      | Precip: 0.1 mm    | Precip: 5 mm        |
// | Visibility: >10 km | Visibility: >10 km| Visibility: >10 km| Visibility: >10 km  |
// +--------------------+-------------------+-------------------+---------------------|
// -----------------------------------------------------------------------------------+
// |                                                                                  |
// -----------------------------------------------------------------------------------+
// | 07:00 PM          | 10:00 PM          | 01:00 AM (Next Day) | 04:00 AM (Next Day)|
// --------+----------------+---------------------+---------------------+-------------+
// | 🌥 Mostly Cloudy  | 🌥 Mostly Cloudy  | 🌤 Partly Cloudy     | 🌥 Mostly Cloudy   |
// | Temp: 26°C        | Temp: 26°C        | Temp: 25°C          | Temp: 25°C         |
// | Wind: S → N       | Wind: SW → NE     | Wind: SW → NE       | Wind: SW → NE      |
// | 9.2 km/h          | 10 km/h           | 12.5 km/h           | 11.3 km/h          |
// | Humidity: 90%     | Humidity: 88%     | Humidity: 90%       | Humidity: 90%      |
// | Precip: 1.8 mm    | Precip: 0 mm      | Precip: 0 mm        | Precip: 0 mm       |
// | Visibility: >10 km| Visibility: >10 km| Visibility: >10 km  | Visibility: >10 km |
// +-------------------+-------------------+---------------------+--------------------+

///////////////////////////////////////////////////////////////////////////////////////


async function fetchWeatherData(selectedLocation) {
  try {
    const lowercaseSelectedLocation = selectedLocation.toLowerCase();

    const locationCode = areaCode.locations[lowercaseSelectedLocation];

    if (!locationCode) {
      throw new Error(`Location data for '${selectedLocation}' not found.`);
    }

    const url = `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${locationCode}`;
    console.log('Fetching data from:', url);

    const response = await fetch(url);
    // console.log(`response : ${response}`)
    const jsonData = await response.json();
    // console.log(`jsonData : ${jsonData}`)

    const { locationData, weatherData } = extractWeatherData(jsonData);

    // console.log(locationData, weatherData)

    return { locationData: locationData, weatherData: weatherData };

  } catch (error) {
    console.error('Error fetching or processing data:', error);
    throw error;
  }
}

function extractWeatherData(jsonData) {
  if (!jsonData.lokasi || !jsonData.data) {
    console.error("Ada data yang undefined");
    return {};
  }
  const specficLocationData = jsonData.data[0];
  const locationData = specficLocationData.lokasi;
  const weatherData = specficLocationData.cuaca;
  // console.log(`locationData`, locationData);
  // console.log(`weatherData`, weatherData);

  return { locationData, weatherData }
}

module.exports = { fetchWeatherData };
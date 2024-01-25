var convert = require('xml-js');
var areaPerURL = require('../Data/areaPerURL.json')

///////////////////////////////////////////////////////////////////////////////////////
// Parameter (key)
// Waktu dalam UTC-YYYYMMDDHHmmss (key id: timerange)
// Cuaca berupa kode cuaca (key id: weather)
// Suhu Udara dalam °C dan °F (key id: t)
// Suhu Udara Minimum dalam °C dan °F (key id: tmin)
// Suhu Udara Maksimum dalam °C dan °F (key id: tmax)
// Kelembapan Udara dalam % (key id: hu)
// Kelembapan Udara Minimum dalam % (key id: humin)
// Kelembapan Udara Maksimum dalam % (key id: humax)
// Kecepatan Angin dalam knot, mph, kph, dan ms (key id: ws)
// Arah Angin dalam derajat, CARD, dan SEXA (key id: wd)

// Kode Cuaca
// 0 : Cerah / Clear Skies
// 1 : Cerah Berawan / Partly Cloudy
// 2 : Cerah Berawan / Partly Cloudy
// 3 : Berawan / Mostly Cloudy
// 4 : Berawan Tebal / Overcast
// 5 : Udara Kabur / Haze
// 10 : Asap / Smoke
// 45 : Kabut / Fog
// 60 : Hujan Ringan / Light Rain
// 61 : Hujan Sedang / Rain
// 63 : Hujan Lebat / Heavy Rain
// 80 : Hujan Lokal / Isolated Shower
// 95 : Hujan Petir / Severe Thunderstorm
// 97 : Hujan Petir / Severe Thunderstorm

// Kode Arah Angin (CARD) (dibaca: dari arah ...)
// N (North)
// NNE (North-Northeast)
// NE (Northeast)
// ENE (East-Northeast)
// E (East)
// ESE (East-Southeast)
// SE (Southeast)
// SSE (South-Southeast)
// S (South)
// SSW (South-Southwest)
// SW (Southwest)
// WSW (West-Southwest)
// W (West)
// WNW (West-Northwest)
// NW (Northwest)
// NNW (North-Northwest)
// VARIABLE (berubah-ubah)
///////////////////////////////////////////////////////////////////////////////////////


async function fetchWeatherData(selectedLocation, selectedParam) {
  try {
    console.log(selectedLocation);
    console.log(selectedParam);

    const selectedArea = areaPerURL.areas.find(area => {
      return area.name === selectedLocation || (area.areas && area.areas.includes(selectedLocation));
    });

    const url = `https://data.bmkg.go.id/DataMKG/MEWS/DigitalForecast/DigitalForecast-${selectedArea.name}.xml`;
    console.log('Fetching data from:', url);

    const response = await fetch(url);
    const xmlText = await response.text();


    const options = { compact: true, ignoreAttributes: false };
    const jsonData = JSON.parse(convert.xml2json(xmlText, options));

    const areaData = extractData(jsonData);
    const areaDataMapped = areaData.map(area => area.area);
    const areaDataFiltered = areaDataMapped.find(item => item.name === selectedLocation);

    const multValuesArray = [
      'tmax', 'tmin', 't',
      'wd', 'ws'
    ]
    const selectedMultValues = ['C', 'Kt', 'deg'];

    const multipleValues = (
      multValuesArray.includes(selectedParam.toLowerCase())
    );
    if (areaDataFiltered && areaDataFiltered.parameter) {
      const specificParameter = {
        id: areaDataFiltered.id,
        name: areaDataFiltered.name,
        parameter: areaDataFiltered.parameter.find(param => param.id === selectedParam)
      }
      if (specificParameter.parameter.timerange) {
        const locationName = specificParameter.name;
        const labels = specificParameter.parameter.timerange.map(timeRange => timeRange.datetime);
        const formattedDates = convertTimestamps(labels);
        const parameterData = multipleValues ?
          specificParameter.parameter.timerange
            .map(timeRange => timeRange.value)
            .flat()
            .filter(value => selectedMultValues.includes(value.unit))
            .map(value => value._text) :
          specificParameter.parameter.timerange.map(timeRange => timeRange.value._text);
        return {
          labels: formattedDates,
          locationName: locationName,
          parameterData: parameterData,
        };
      } else {
        console.error('Invalid data structure: Ga ada field timerange.');
      }
    } else {
      console.error('Invalid data structure: Ga ada field parameter atau lokasi tidak sesuai (gunakan nama full).');
    }
  } catch (error) {
    console.error('Gagal fetch / proses data:', error);
  }
}

function extractData(jsonData) {
  const areas = jsonData.data.forecast.area;
  return areas.map(area => {
    const areaData = {
      id: area._attributes.id,
      name: area.name.find(name => name._attributes['xml:lang'] === 'en_US')._text,
      parameter: []
    };
    area.parameter.forEach(parameter => {
      const multipleValues = (
        parameter._attributes.description.toLowerCase().includes('temperature') ||
        parameter._attributes.description.toLowerCase().includes('wind')
      );
      const paramData = {
        id: parameter._attributes.id,
        timerange: []
      };
      if (parameter.timerange) {
        parameter.timerange.forEach(timerange => {
          if (multipleValues) {
            const timeData = {
              datetime: timerange._attributes.datetime,
              value: []
            };
            timerange.value.forEach(value_elm => {
              const valueUnit = value_elm._attributes.unit;
              const valueText = value_elm._text;
              const valueData = {
                unit: valueUnit,
                _text: valueText
              };
              timeData.value.push(valueData);
            });
            paramData.timerange.push(timeData);
          } else {
            const timeData = {
              datetime: timerange._attributes.datetime,
              value: {
                unit: timerange.value._attributes.unit,
                _text: timerange.value._text
              }
            };
            paramData.timerange.push(timeData);
          }
        });
      }
      areaData.parameter.push(paramData);
    });
    return { area: areaData };
  });
}

function convertTimestamps(labels) {
  const formattedDates = labels.map(timestamp => {
    const year = timestamp.slice(0, 4);
    const month = timestamp.slice(4, 6);
    const day = timestamp.slice(6, 8);
    const hour = timestamp.slice(8, 10);
    const minute = timestamp.slice(10, 12);
    const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);
    return date.toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });
  });

  return formattedDates;
}
module.exports = { fetchWeatherData };

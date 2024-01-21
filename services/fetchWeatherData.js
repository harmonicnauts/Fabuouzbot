var convert = require('xml-js');

document.addEventListener('DOMContentLoaded', fetchData);


async function fetchWeatherData() {
  try {
    const response = await fetch('https://data.bmkg.go.id/DataMKG/MEWS/DigitalForecast/DigitalForecast-Indonesia.xml');
    const xmlText = await response.text();

    const options = { compact: true, ignoreAttributes: false };
    const jsonData = JSON.parse(convert.xml2json(xmlText, options));

    const areaData = extractData(jsonData);
    // console.log('areaData[0].area.parameter[0]', areaData[0].area.parameter[0]);

    if (areaData.length > 0 && areaData[0].area.parameter) {
      const firstParameter = areaData[0].area.parameter[0];

      if (firstParameter.timerange) {
        const labels = firstParameter.timerange.map(timeRange => timeRange.datetime);
        // console.log('labels', labels)
        const temperatureData = areaData.map(area => {
          // console.log('area inside map', area.area.parameter.find(param => param.id === 'hu'))
          const temperatureParam = area.area.parameter.find(param => param.id === 'hu');
          if (temperatureParam && temperatureParam.timerange) {
            return temperatureParam.timerange.map(timeRange => parseFloat(timeRange.value._text));
          }
          return [];
        });

        console.log('jsonData', jsonData)
        console.log('areaData', areaData)
        console.log('labels', labels)
        console.log('temperatureData', temperatureData)

        plotChart(labels, areaData, temperatureData);
      } else {
        console.error('Invalid data structure: Ga ada field timerange.');
      }
    } else {
      console.error('Invalid data structure: Ga ada field parameter.');
    }
  } catch (error) {
    console.error('Gagal fetch / proses data:', error);
  }
}

function extractData(jsonData) {
  const areas = jsonData.data.forecast.area;

  // console.log('areas', areas);

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
      // console.log('parameter : ', parameter)
      // console.log('multipleValues : ', multipleValues);
      const paramData = {
        id: parameter._attributes.id,
        timerange: []
      };

      if (parameter.timerange) {
        parameter.timerange.forEach(timerange => {
          // console.log('timerange', timerange);
          // console.log('atribut', timerange.value._attributes);

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
              // console.log('value data : ', valueData);
              timeData.value.push(valueData);
            });

            // console.log('timeData (multipleValues) : ', timeData);
            paramData.timerange.push(timeData);
          } else {
            const timeData = {
              datetime: timerange._attributes.datetime,
              value: {
                unit: timerange.value._attributes.unit,
                _text: timerange.value._text
              }
            };

            // console.log('timeData (singleValue) : ', timeData);
            paramData.timerange.push(timeData);
          }
        });
      }

      areaData.parameter.push(paramData);
    });

    return { area: areaData };
  });
}

// function parseXML(xml) {
//   const jsonData = [];
//   const areas = xml.querySelectorAll('area');

//   areas.forEach(area => {
//     const areaData = {
//       id: area.getAttribute('id'),
//       name: area.querySelector('name').textContent,
//       parameter: []
//     };

//     const parameters = area.querySelectorAll('parameter[type="hourly"]');
//     parameters.forEach(parameter => {
//       const paramData = {
//         id: parameter.getAttribute('id'),
//         timerange: []
//       };

//       const timeranges = parameter.querySelectorAll('timerange');
//       timeranges.forEach(timerange => {
//         const timeData = {
//           datetime: timerange.getAttribute('datetime'),
//           value: [{
//             unit: timerange.querySelector('value').getAttribute('unit'),
//             textContent: timerange.querySelector('value').textContent
//           }]
//         };

//         paramData.timerange.push(timeData);
//       });

//       areaData.parameter.push(paramData);
//     });

//     jsonData.push({ area: areaData });
//   });

//   return jsonData;
// }

module.exports = { fetchWeatherData };

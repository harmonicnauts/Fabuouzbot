var convert = require('xml-js');

async function fetchWeatherData(selectedLocation, selectedParam) {
  try {
    console.log(selectedLocation);
    console.log(selectedParam);
    const response = await fetch('https://data.bmkg.go.id/DataMKG/MEWS/DigitalForecast/DigitalForecast-Indonesia.xml');
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

      // console.log('specificParameter', specificParameter)

      if (specificParameter.parameter.timerange) {
        const locationName = specificParameter.name;
        const labels = specificParameter.parameter.timerange.map(timeRange => timeRange.datetime);

        console.log('wheres the value', specificParameter.parameter.timerange
          .map(timeRange => timeRange.value)
          .flat()
          .filter(value => selectedMultValues.includes(value.unit))
          .forEach(value => console.log(value)))


        // const parameterData = specificParameter.parameter.timerange.map(timeRange => timeRange.value._text);
        //areaDataMapped.find(item => item.name === selectedLocation);
        const parameterData = multipleValues ?
          specificParameter.parameter.timerange
            .map(timeRange => timeRange.value)
            .flat()
            .filter(value => selectedMultValues.includes(value.unit))
            .map(value => value._text) :
          specificParameter.parameter.timerange.map(timeRange => timeRange.value._text);


        return {
          labels: labels,
          locationName: locationName,
          parameterData: parameterData,
        };
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

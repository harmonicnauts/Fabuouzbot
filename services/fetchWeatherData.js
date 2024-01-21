var convert = require('xml-js');

async function fetchWeatherData() {
  try {
    const response = await fetch('https://data.bmkg.go.id/DataMKG/MEWS/DigitalForecast/DigitalForecast-Indonesia.xml');
    const xmlText = await response.text();

    // Convert XML to JSON
    // const parser = new DOMParser();
    // const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const jsonData = JSON.parse(convert.xml2json(xmlText, { compact: false }));

    // Extract the relevant data for chart.js
    console.log(`jsonData : ${jsonData}`);
    const areaData = jsonData.map(entry => entry.area);
    console.log(`areaData : ${areaData}`);
    const labels = areaData[0].parameter[0].timerange.map(timeRange => timeRange.datetime);
    const temperatureData = areaData.map(area => area.parameter.find(param => param.id === 't').timerange.map(timeRange => parseFloat(timeRange.value[0].textContent)));

    // Plot the data using Chart.js
    plotChart(labels, areaData, temperatureData);
  } catch (error) {
    console.error('Error fetching or processing data:', error);
  }
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

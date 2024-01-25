const { ApplicationCommandOptionType, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const { fetchWeatherData } = require('../services/fetchWeatherData');

module.exports = {
  name: 'weather_forecast',
  description: 'Nampilin prediksi 3 hari cuaca.',
  options: [
    {
      name: 'parameter',
      type: ApplicationCommandOptionType.String,
      description: '("hu", "humax", "tmax", "humin", "tmin", "t", "weather", "wd", "ws")',
      required: true,
    },
    {
      name: 'lokasi',
      type: ApplicationCommandOptionType.String,
      description: 'provinsi yang mau ditampilin. (nama full)',
      required: true,
    },
  ],
  async execute(interaction, client) {
    try {
      const idMapping = {
        'hu': 'Humidity',
        'humax': 'Max Humidity',
        'tmax': 'Max Temperature',
        'humin': 'Min Humidity',
        'tmin': 'Min Temperature',
        't': 'Temperature',
        'weather': 'Weather',
        'wd': 'Wind Direction',
        'ws': 'Wind Speed'
      };

      const selectedLocation = interaction.options.getString('lokasi');
      const selectedParam = interaction.options.getString('parameter');

      const { labels, locationName, parameterData } = await fetchWeatherData(selectedLocation, selectedParam); // Fetch data

      const selectedParameterLong = idMapping[selectedParam];

      // console.log('labels', labels);
      // console.log('locationName', locationName);
      // console.log('parameterData', parameterData);

      const data = {
        labels: labels,
        datasets: [
          {
            label: locationName,
            data: parameterData,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.3,
          }
        ]
      };

      const renderer = new ChartJSNodeCanvas({ type: 'jpg', width: 1000, height: 400, backgroundColour: 'white' });
      const image = await renderer.renderToBuffer({
        type: "line",
        data: data,
      });

      const attachment = new AttachmentBuilder(image, { name: 'graph.png' });


      // console.log(`labels : ${labels}`);
      // console.log(`areaData :`);
      // console.log(areaData);
      // console.log(`parameterData : ${parameterData}`)

      const chartEmbed = new EmbedBuilder()
        .setTitle(`Prediksi ${selectedParameterLong}`)
        .setFields({ name: 'Lokasi', value: locationName })
        .setFooter({ text: 'Data provided by BMKG at https://data.bmkg.go.id/prakiraan-cuaca/' })
      chartEmbed.setImage("attachment://graph.png");


      interaction.reply({
        embeds: [chartEmbed],
        files: [attachment]
      });
    } catch (error) {
      console.error('Gagal fetch / proses data:', error);

      interaction.reply({
        content: 'Gagal fetch / proses data.',
        ephemeral: true,
      });
    }
  },
};
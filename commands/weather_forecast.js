const { ApplicationCommandOptionType } = require('discord.js');
const { fetchWeatherData } = require('../services/fetchWeatherData'); // Assuming fetchData.js is in the same directory

module.exports = {
  name: 'weather_forecast',
  description: 'Nampilin prediksi 3 hari cuaca.',
  options: [
    {
      name: 'parameter',
      type: ApplicationCommandOptionType.String,
      description: 'Parameter yang mau ditampilin.',
      required: true,
    },
    {
      name: 'lokasi',
      type: ApplicationCommandOptionType.String,
      description: 'Lokasi yang mau ditampilin.',
      required: true,
    },
  ],
  async execute(interaction, client) {
    try {
      // Fetch data
      const jsonData = await fetchWeatherData();

      // Process data
      const areaData = jsonData.map(entry => entry.area);
      const labels = areaData[0].parameter[0].timerange.map(timeRange => timeRange.datetime);
      const temperatureData = areaData.map(area => area.parameter.find(param => param.id === 't').timerange.map(timeRange => parseFloat(timeRange.value[0].textContent)));

      console.log(`labels : ${labels}`)
      console.log(`temperatureData : ${temperatureData}`)

      // Reply with the processed data
      interaction.reply({
        embeds: [userInfoEmbed], // You might want to create a new embed using the processed data
      });
    } catch (error) {
      console.error('Error fetching or processing data:', error);
      // Handle the error or reply with an error message
      interaction.reply('Error fetching or processing data. Please try again later.');
    }
  },
};
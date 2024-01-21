const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { fetchWeatherData } = require('../services/fetchWeatherData');

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
      const { labels, areaData, parameterData } = await fetchWeatherData();

      const data = {
        labels: labels,
        datasets: areaData.map((area, index) => ({
          label: area.area.name,
          data: parameterData[index],
        }))
      };



      console.log(`labels : ${data.labels[0]}`);
      console.log(`areaData :  ${data.datasets[0].label}`);
      console.log(`parameterData : ${data.datasets[0].data}`);

      const userInfoEmbed = new EmbedBuilder()
        .setColor('#0349fc')
        .setTitle(`Tes 3 Day Weather Forecast`)
        .addFields(
          { name: 'Labels', value: `${data.labels[0]}` },
          { name: 'areaData', value: `${data.datasets[0].label}` },
          { name: 'parameterData', value: `${data.datasets[0].data}` },
        )
      // Reply with the processed data
      interaction.reply({
        embeds: [userInfoEmbed],
      });
    } catch (error) {
      console.error('Gagal fetch / proses data:', error);

      interaction.reply('Gagal fetch / proses data.');
    }
  },
};
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

      const renderer = new ChartJSNodeCanvas({ type: 'jpg', width: 800, height: 300, backgroundColour: 'white' });
      const image = await renderer.renderToBuffer({
        type: "line",
        data: data,
      });

      const attachment = new AttachmentBuilder(image, { name: 'graph.png' });


      // console.log(`data.labels[0] : ${data.labels[0]}`);
      // console.log(`data.datasets[0].label :  ${data.datasets[0].label}`);
      // console.log(`data.datasets[0].data : ${data.datasets[0].data}`);

      // console.log(`labels : ${labels}`);
      // console.log(`areaData :`);
      // console.log(areaData);
      // console.log(`parameterData : ${parameterData}`)

      const chartEmbed = new EmbedBuilder()
        .setTitle('test')
      chartEmbed.setImage("attachment://graph.png");


      interaction.reply({
        embeds: [chartEmbed],
        files: [attachment]
      });
    } catch (error) {
      console.error('Gagal fetch / proses data:', error);

      interaction.reply('Gagal fetch / proses data.');
    }
  },
};
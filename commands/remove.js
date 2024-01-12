const { GuildMember, ApplicationCommandOptionType } = require('discord.js');
const { useQueue } = require("discord-player");
const { isInVoiceChannel } = require("../utils/voicechannel");

module.exports = {
  name: 'remove',
  description: 'menghapus musik dari queue.',
  options: [
    {
      name: 'number',
      type: ApplicationCommandOptionType.Integer,
      description: 'Banyak track yang ingin dihapus dari queue.',
      required: true,
    },
  ],
  async execute(interaction) {
    const inVoiceChannel = isInVoiceChannel(interaction)
    if (!inVoiceChannel) {
      return
    }

    await interaction.deferReply();
    const queue = useQueue(interaction.guild.id);
    if (!queue || !queue.currentTrack) return void interaction.followUp({ content: '❌ | Tidak ada musik yang sedang dimainkan.' });
    const number = interaction.options.getInteger('number') - 1;
    if (number > queue.tracks.size)
      return void interaction.followUp({ content: '❌ | Jumlah musik tidak boleh melebihi ukuran queue.' });
    const removedTrack = queue.node.remove(number);
    return void interaction.followUp({
      content: removedTrack ? `✅ | Removed **${removedTrack}**!` : '❌ | Terjadi kesalahan.',
    });
  },
};

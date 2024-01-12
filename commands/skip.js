const { GuildMember } = require('discord.js')
const { useQueue } = require('discord-player')
const { isInVoiceChannel } = require("../utils/voicechannel");

module.exports = {
    name: 'skip',
    description: 'Skip musik yang lagi dimainkan.',
    async execute(interaction) {
        const inVoiceChannel = isInVoiceChannel(interaction)
        if (!inVoiceChannel) {
            return
        }

        await interaction.deferReply();

        const queue = useQueue(interaction.guild.id)
        if (!queue || !queue.currentTrack) return void interaction.followUp({ content: '❌ | Lagi ga ada musik yang playing.' });
        const currentTrack = queue.currentTrack;

        const success = queue.node.skip()
        return void interaction.followUp({
            content: success ? `✅ | Skipped **${currentTrack}**!` : '❌ | Terjadi kesalahan',
        });
    },
};

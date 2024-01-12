const { GuildMember } = require('discord.js')
const { useQueue } = require('discord-player')
const { isInVoiceChannel } = require("../utils/voicechannel");

module.exports = {
    name: 'skip',
    description: 'Skip musik yang sedang dimainkan.',
    async execute(interaction) {
        const inVoiceChannel = isInVoiceChannel(interaction)
        if (!inVoiceChannel) {
            return
        }

        await interaction.deferReply();

        const queue = useQueue(interaction.guild.id)
        if (!queue || !queue.currentTrack) return void interaction.followUp({ content: '❌ | Tidak ada musik yang sedang dimainkan.' });
        const currentTrack = queue.currentTrack;

        const success = queue.node.skip()
        return void interaction.followUp({
            content: success ? `✅ | Skipped **${currentTrack}**!` : '❌ | Terjadi kesalahan',
        });
    },
};

const { GuildMember } = require('discord.js');
const { useQueue } = require("discord-player");
const { isInVoiceChannel } = require("../utils/voicechannel");

module.exports = {
    name: 'pause',
    description: 'Pause musik yang sedang dimainkan.',
    async execute(interaction) {
        const inVoiceChannel = isInVoiceChannel(interaction)
        if (!inVoiceChannel) {
            return
        }

        await interaction.deferReply();
        const queue = useQueue(interaction.guild.id)
        if (!queue || !queue.currentTrack)
            return void interaction.followUp({
                content: '❌ | Tidak ada musik yang sedang dimainkan!',
            });
        const success = queue.node.pause()
        return void interaction.followUp({
            content: success ? '⏸ | Paused.' : '❌ | Terjadi kesalahan.',
        });
    },
};

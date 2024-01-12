const { GuildMember, ApplicationCommandOptionType } = require('discord.js');
const { QueryType, useMainPlayer } = require('discord-player');
const { isInVoiceChannel } = require("../utils/voicechannel");

module.exports = {
    name: 'play',
    description: 'Command untuk memainkan musik di channel Discord.',
    options: [
        {
            name: 'query',
            type: ApplicationCommandOptionType.String,
            description: 'Query untuk musik yang ingin dimainkan.',
            required: true,
        },
    ],
    async execute(interaction) {
        try {
            const inVoiceChannel = isInVoiceChannel(interaction)
            if (!inVoiceChannel) {
                return
            }

            await interaction.deferReply();

            const player = useMainPlayer()
            const query = interaction.options.getString('query');
            const searchResult = await player.search(query)
            if (!searchResult.hasTracks())
                return void interaction.followUp({ content: 'Ga muncul apa-apa.' });

            try {
                const res = await player.play(interaction.member.voice.channel.id, searchResult, {
                    nodeOptions: {
                        metadata: {
                            channel: interaction.channel,
                            client: interaction.guild?.members.me,
                            requestedBy: interaction.user.username
                        },
                        leaveOnEmptyCooldown: 300000,
                        leaveOnEmpty: true,
                        leaveOnEnd: false,
                        bufferingTimeout: 0,
                        volume: 10,
                        //defaultFFmpegFilters: ['lofi', 'bassboost', 'normalizer']
                    }
                });

                await interaction.followUp({
                    content: `⏱ | Memuat ${searchResult.playlist ? 'playlist' : 'track'} yang dipilih...`,
                });
            } catch (error) {
                await interaction.editReply({
                    content: `Ada error bro. : ${error}`
                })
                return console.log(error);
            }
        } catch (error) {
            await interaction.reply({
                content: 'Terjadi error pas running tu command: ' + error.message,
            });
        }
    },
};

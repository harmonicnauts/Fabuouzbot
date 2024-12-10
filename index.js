require('dotenv').config()

const fs = require('fs');
const Discord = require('discord.js');
const Client = require('./client/Client');
const config = require('./config.json');
const { Player } = require('discord-player');
const { cyclePresenceStatus } = require('./utils/presenceManager');

const client = new Client();
client.commands = new Discord.Collection();

// const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js') && !file.startsWith('exc_'));


for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

console.log(client.commands);

const player = new Player(client);

player.extractors.loadDefault().then(r => console.log('Extractors loaded successfully'));

// Still needs to be refactored for 0.6
/*player.events.on('connection', (queue) => {
    queue.connection.connec.voiceConnection.on('stateChange', (oldState, newState) => {
      const oldNetworking = Reflect.get(oldState, 'networking');
      const newNetworking = Reflect.get(newState, 'networking');

      const networkStateChangeHandler = (oldNetworkState, newNetworkState) => {
        const newUdp = Reflect.get(newNetworkState, 'udp');
        clearInterval(newUdp?.keepAliveInterval);
      }

      oldNetworking?.off('stateChange', networkStateChangeHandler);
      newNetworking?.on('stateChange', networkStateChangeHandler);
    });
});*/

player.events.on('audioTrackAdd', (queue, song) => {
    console.log(`Menambahkan ${song.title} ke queue.`);
    queue.metadata.channel.send(`🎶 | Menambahkan **${song.title}** ke queue.`);
});

player.events.on('playerStart', (queue, track) => {
    console.log(`Player dimulai : Memainkan: ${track.title}!`);
    queue.metadata.channel.send(`▶ | Memainkan: **${track.title}**!`);
});

player.events.on('audioTracksAdd', (queue, track) => {
    console.log(`Track ${track.title} telah diqueue.`);
    queue.metadata.channel.send(`🎶 | Track ${track.title} telah diqueue.`);
});

player.events.on('disconnect', queue => {
    console.log(`Bot telah di-disconnect secara manual.`);
    queue.metadata.channel.send('❌ | Bot telah di-disconnect secara manual. Membersihkan queue...');
});

player.events.on('emptyChannel', queue => {
    console.log(`Voice channel kosong.`);
    queue.metadata.channel.send('❌ | Voice channel kosong. Meninggalkan channel...');
});

player.events.on('emptyQueue', queue => {
    console.log(`Queue selesai!`);
    queue.metadata.channel.send('✅ | Queue selesai!');
});

player.events.on('error', (queue, error) => {
    console.log(`[${queue.guild.name}] Error dihasilkan dari koneksi : ${error.message}`);
});

// For debugging
/*player.on('debug', async (message) => {
    console.log(`General player debug event: ${message}`);
});

player.events.on('debug', async (queue, message) => {
    console.log(`Player debug event: ${message}`);
});

player.events.on('playerError', (queue, error) => {
    console.log(`Player error event: ${error.message}`);
    console.log(error);
});*/

// Default format 
// activities: [{ 
//     name: config.activity, 
//     type: Number(config.activityType) 
// }],

client.on('ready', function () {
    console.log('Ready!');

    cyclePresenceStatus(client, config, Discord);
});

client.once('reconnecting', () => {
    console.log('Reconnecting!');
});

client.once('disconnect', () => {
    console.log('Disconnect!');
});

client.on('messageCreate', async message => {
    if (message.author.bot || !message.guild) return;
    if (!client.application?.owner) await client.application?.fetch();

    if (message.content === '!deploy' && message.author.id === client.application?.owner?.id) {
        await message.guild.commands
            .set(client.commands)
            .then(() => {
                message.reply('Deployed!');
            })
            .catch(err => {
                message.reply(
                    'Tidak bisa menjalankan command deploy! Pastikan bot memiliki permission application.commands!');
                console.error(err);
                console.error('Errors', err.rawError.errors['1'].name._errors);
            });
    }
});

client.on('interactionCreate', async interaction => {
    const command = client.commands.get(interaction.commandName.toLowerCase());

    try {
        if (interaction.commandName == 'ban' || interaction.commandName == 'userinfo') {
            command.execute(interaction, client);
        } else {
            command.execute(interaction);
        }
    } catch (error) {
        console.error(error);
        await interaction.followUp({
            content: 'Terjadi kesalahan dalam menjalankan command.',
        });
    }
});

client.login(process.env.DISCORD_TOKEN);

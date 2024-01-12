# Fabuouoz Bot

Bot for Fabuouz Discord channel. For now it can only be a music player. Will be developed again in the future. Based on some [github music discord bot repository](https://github.com/TannerGabriel/discord-bot).

## Requirements

- [Node](https://nodejs.org/en/) - Version 16 or higher
- [NPM](https://www.npmjs.com/)
- [FFMPEG](https://www.ffmpeg.org/)
- [ytdl](https://github.com/ytdl-org/youtube-dl)

## Installation

Install my-project with npm

```bash
# Clone the repository
git clone https://github.com/Nycht1/Fabuouzbot.git

# Enter into the directory
cd discord-bot/

# Install the dependencies
npm install

# Configure Discord Bot Token
 echo "DISCORD_TOKEN='INSERT_YOUR_TOKEN_HERE'" > .env
```

## Required Permissions.

Make sure that your bot has the `applications.commands` application scope enabled, which can be found under the `OAuth2` tab on the [developer portal](https://discord.com/developers/applications/)

Enable the `Server Members Intent` and `Message Content Intent` which can be found under the `Bot` tab on the [developer portal](https://discord.com/developers/applications/)

## Features and Commands.

### Play

▶️ Play music from YouTube via url or search by song name, added to the bottom of the queue.

`/play YOUTUBE_URL`  
`/play SONG_NAME`

▶️ Play music via url or using song name, this places it next at the top of the queue (position 1).

`/playtop YOUTUBE_URL`  
`/playtop SONG_NAME`

### Pause

⏸️ Pause music

`/pause`

### Resume

▶️ Resume playing paused music

`/resume`

### Now Playing

🎶 Display current playing song

`/nowplaying`

### Queue

🗒️ Display the current queue

`/queue`

### Shuffle

🔀 Shuffle the current queue

`/shuffle`

### Loop

🔁 Loop/Repeat controls. Off, Track and Queue

`/loop MODE`

### Skip

⏭️ Skip the current playing song and play the next in queue

`/skip`

### Remove

⏏ Remove song from the queue

`/remove POSITION`

### Move

↕ Move song position. This shifts all other songs up or down one, depending on direction you move the target song.

`/move TRACK_POSITION TARGET_POSITION`

### Swap

↔️ Swap two songs current positions with each other

`/swap POSITION_1 POSITION_2`

### Stop

🔇 Stop playing (disconnects bot from voice channel)

`/stop`

### Volume

🔊 Adjust the music bot volume between 0-200

`/volume NUMBER`

### Help

❓ Display commands

`/help`

### Userinfo

- Get information about a user (/userinfo USER)

### Ban

- Ban a player (/ban USER)

### Purge

- Delete the latest chat messages (/purge NUM_OF_MESSAGES)

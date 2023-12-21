import discord
from discord.ext import commands, tasks
from discord.voice_client import VoiceClient
import asyncio
import youtube_dl
import os
import itertools

from random import choice

youtube_dl.utils.bug_reports_message = lambda: ''

ytdl_format_options = {
    'format': 'bestaudio/best',
    'outtmpl': '%(extractor)s-%(id)s-%(title)s.%(ext)s',
    'restrictfilenames': True,
    'noplaylist': True,
    'nocheckcertificate': True,
    'ignoreerrors': False,
    'logtostderr': False,
    'quiet': True,
    'no_warnings': True,
    'default_search': 'auto',
    'source_address': '0.0.0.0'
}

ffmpeg_options = {
    'options': '-vn'
}

ytdl = youtube_dl.YoutubeDL(ytdl_format_options)

class YTDLSource(discord.PCMVolumeTransformer):
    def __init__(self, source, *, data, volume=0.5):
        super().__init__(source, volume)
        self.data = data
        self.title = data.get('title')
        self.url = data.get('url')

    @classmethod
    async def from_url(cls, url, *, loop=None, stream=False):
        loop = loop or asyncio.get_event_loop()
        data = await loop.run_in_executor(None, lambda: ytdl.extract_info(url, download=not stream))

        if 'entries' in data:
            # take first item from a playlist
            data = data['entries'][0]

        filename = data['url'] if stream else ytdl.prepare_filename(data)
        return cls(discord.FFmpegPCMAudio(filename, **ffmpeg_options), data=data)


client = commands.Bot(command_prefix='?')

status = ['Stay Fabuouz', 'Wear your mask and smoke crack','Rehan Bait No.1','TATAKAE']
queue = []

@client.event
async def on_ready():
    change_status.start()
    print('Bot is online!')


@client.command(name='ping', help='This command returns the latency')
async def ping(ctx):
    await ctx.send(f'Latency: {round(client.latency * 1000)}ms')

@client.command(name = "join")
async def join(ctx):
    if not ctx.message.author.voice:
        await ctx.send("You are not connected to a voice channel")
        return
    else:
        channel = ctx.message.author.voice.channel

    await channel.connect()


@client.command(name='play', help='This command plays music')
async def play(ctx):
    server = ctx.message.guild
    voice_channel = server.voice_client

    async with ctx.typing():
        player = await YTDLSource.from_url(queue[0], loop=client.loop)
        voice_channel.play(player, after=lambda e: print('Player error: %s' % e) if e else None)
        del(queue[0])

    await ctx.send('**Now playing:** {}'.format(player.title))
  
@client.command(name = "pause")
async def pause(ctx):
  server = ctx.message.guild
  voice_channel = server.voice_client
  voice_channel.pause()

@client.command(name = "resume")
async def resume(ctx):
  server = ctx.message.guild
  voice_channel = server.voice_client
  voice_channel.resume()

@client.command(name = "stop")
async def stop(ctx):
  server = ctx.message.guild
  voice_channel = server.voice_client
  voice_channel.stop()

@client.command(name = "queue")
async def queue_ (ctx, url):
  global queue
  queue.append(url)
  await ctx.send(f"`{url}` added to the queue")

@client.command(name="remove")
async def remove(ctx, number):
  global queue
  try:
    del(queue[int(number)])
    await ctx.send(f"Your queue is now `{queue}`")
  except:
    await ctx.send("The queue is empty/")

@client.command(name = "view")
async def view(ctx):
  upcoming = list(itertools.islice())

@client.command(name='leave', help='This command stops the music and makes the bot leave the voice channel')
async def leave(ctx):
    voice_client = ctx.message.guild.voice_client
    await voice_client.disconnect()

@tasks.loop(seconds=60)
async def change_status():
    await client.change_presence(activity=discord.Game(choice(status)))

client.run(os.getenv('TOKEN'))
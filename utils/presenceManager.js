const cyclePresenceStatus = (client, config, Discord) => {
    let currentActivityIndex = Math.floor(Math.random() * config.length);;

    client.user.presence.set({
        activities: [{
            name: config[currentActivityIndex].activityName,
            type: Number(config[currentActivityIndex].activityType)
        }],
        status: Discord.Status.Ready
    });

    // Change activity every minute
    setInterval(() => {
        currentActivityIndex = Math.floor(Math.random() * config.length);

        client.user.setPresence({
            activities: [{
                name: config[currentActivityIndex].activityName,
                type: Number(config[currentActivityIndex].activityType)
            }],
            status: Discord.Status.Ready
        });
    }, 60000); // 60000 ms = 1 minute
}

module.exports = { cyclePresenceStatus };

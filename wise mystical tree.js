const net = require("net");
const { Client, Events, GatewayIntentBits, ActivityType, ApplicationCommandOptionType } = require('discord.js');
const { token } = require("./config.json");

var channel = null;
var guild = null;
const guildid = '903229026972352513';
const channelid = '903229026972352516';
const botid = '1035937419817652316';

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
    ] 
});

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});
/*
client.on("messageCreate", (message) => {
    if (message.author.id != botid){
        message.channel.send("faded than a ho");
        if (channel){
            channel.send("yodie gang");
        }
    }
});
*/
client.on('ready', () => {
    client.channels.fetch(channelid).then(c => channel = c);
    client.guilds.fetch(guildid).then(g => guild = g);
    let commands;

    if (guild) {
        commands = guild.commands;
    } else {
        commands = client.application?.commands;
    }

    commands?.create({
        name: "send",
        description: "send a message in the minecraft chat",
        options: [
            {
                name: "message",
                description: "the message you want to send",
                required: true,
                type: ApplicationCommandOptionType.String,
            }
        ]
    });

    client.user.setPresence({
        activities: [{name: "the bits and the bytes", type: ActivityType.Watching}],
        status: "dnd"
    });
});
client.login(token);

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand())
        return;
    
        const { commandName, options } = interaction;

        if (commandName === "send") {
            interaction.reply({
                content: options,
                ephemeral: true,
            });
        }
});

const server = net.createServer();
server.on("connection", handleConnection);
server.listen(6969, function() {
    console.log("server listening to", server.address());
});

function handleConnection(conn){
    var remoteAddress = conn.remoteAddress + ":" + conn.remotePort;
    console.log("new client connection from ", remoteAddress);

    conn.setEncoding('utf8');

    conn.on("data", onConnData);
    conn.once("close", onConnClose);
    conn.on("error", onConnError);

    function onConnData(d){
        console.log("connection data from: ", remoteAddress, " : ", d, d.length);
        if (d[0] != "\\"){
            str = "**" + d.slice(0, d.indexOf(':')) + "**:" + d.slice(d.indexOf(':') + 1);
            channel.send(str);
        }
        else {
            str = parseInt(d.slice(1, d.length));
            pres = {}
            if (str == 0){
                pres = {
                    activities: [{name: "the bits and the bytes", type: ActivityType.Watching}],
                    status: "dnd"
                };
            }
            else {
                pres = {
                    activities: [{name: str + (str == 1 ? " player" : " players"), type: ActivityType.Watching}],
                    status: "online"
                };
            }
            client.user.setPresence(pres);
        }
        conn.write(d);
    }

    function onConnClose(){
        console.log("connection from ", remoteAddress, " closed");
    }

    function onConnError(err){
        console.log("connection ", remoteAddress, " error: ", err.message);
    }
}

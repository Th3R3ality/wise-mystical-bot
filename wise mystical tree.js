const net = require("net");
const fs = require("node:fs");
const path = require("node:path");
const { Client, Events, GatewayIntentBits, ActivityType, ApplicationCommandOptionType, Collection } = require('discord.js');
const { token } = require("./token.json");
const { guildid, channelid, botid } = require("./config.json");

var channel = null;
var guild = null;

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
    ] 
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}


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

    client.user.setPresence({
        activities: [{name: "the bits and the bytes", type: ActivityType.Watching}],
        status: "dnd"
    });
});
client.login(token);

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    console.log(interaction);

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`no command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (e) {
        console.error(e);
        await interaction.reply({content: "There was an error while executing this command!", ephemeral: true});
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
                };} else {
                pres = {
                    activities: [{name: str + (str == 1 ? " player" : " players"), type: ActivityType.Watching}],
                    status: "online"
                };}
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

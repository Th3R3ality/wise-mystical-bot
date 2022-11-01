const net = require("net");
const fs = require("node:fs");
const path = require("node:path");
const { Client, Events, GatewayIntentBits, ActivityType, ApplicationCommandOptionType, Collection } = require('discord.js');
const { token, guildid, channelid, botid } = require("./config.json");

var channel = null;
var guild = null;

const wise_client = new net.Socket();
wise_client.connect(1337, 'localhost', function() {
	console.log('Connected');
	wise_client.write('Hello, server! Love, wise_client.\n');
});

wise_client.on('data', function(data) {
	console.log('Received: ' + data);
	wise_client.destroy(); // kill wise_client after server's response
});

wise_client.on('close', function() {
	console.log('Connection closed');
});

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
    client.channels.fetch(channelid).then(c => channel = c);
    client.guilds.fetch(guildid).then(g => guild = g);

    client.user.setPresence({
        activities: [{name: "the bits and the bytes", type: ActivityType.Watching}],
        status: "dnd"
    });
});
client.login(token);

const wise_server = net.createServer();
wise_server.on("connection", handleConnection);
wise_server.listen(6969, function() {
    console.log("server listening to", wise_server.address());
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    console.log(interaction);
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
        console.error(`no command matching ${interaction.commandName} was found.`);
        return;
    }
    try {
        if (interaction.commandName == "send"){
            let message = interaction.options.getString("message");
            wise_client.write(interaction.user.tag + ":" + message + "\n");
            console.log(`sent: ${message}`);
        }
        await command.execute(interaction);
    } catch (e) {
        console.error(e);
        await interaction.reply({content: "There was an error while executing this command!", ephemeral: true});
    }
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

        if (d[0] != "\\") {
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
        //conn.write(d);
    }

    function onConnClose(){
        console.log("connection from ", remoteAddress, " closed");
    }

    function onConnError(err){
        console.log("connection ", remoteAddress, " error: ", err.message);
    }
}

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


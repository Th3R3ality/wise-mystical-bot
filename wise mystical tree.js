const net = require("net");
const fs = require("node:fs");
const path = require("node:path");
const { Client, Events, GatewayIntentBits, ActivityType, ApplicationCommandOptionType, Collection } = require('discord.js');
const { token, guildid, channelid, botid } = require("./config.json");

var channel = null;
var guild = null;
var reopen = false;

const wise_client = new net.Socket();
const wise_server = net.createServer();
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
    ] 
});

//initialize commands
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

//initialize discord client
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

//command handler
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    console.log(interaction);
    const command = interaction.client.commands.get(interaction.commandName);
    
    if (!command){
        console.error(`no command matching ${interaction.commandName} was found.`); return;
    }
    if (!wise_client){
        console.error(`wise_client not connected`);
        await interaction.reply({content: "couldn't execute command, not connected to minecraft", ephemeral: true});
        return;
    }

    try {
        await command.execute(interaction, wise_client);
    } catch (e) {
        console.error(e);
        await interaction.reply({content: "There was an error while executing this command!", ephemeral: true});
    }
});

//server socket initialization and handling
wise_server.on("connection", handleConnection);
wise_server.listen(6969, () => {
    console.log(`wise_server: server listening to: `, wise_server.address());
});
function handleConnection(connection){
    var remoteAddress = connection.remoteAddress + ":" + connection.remotePort;
    console.log(`wise_server: new client connection from: ${remoteAddress}`);

    connection.on("data", data => {
        
        console.log(`wise_server: recieved data from: ${remoteAddress} => ${data}`);

        if (data[0] != "\\") {
            str = "**" + data.slice(0, data.indexOf(':')) + "**:" + data.slice(data.indexOf(':') + 1);
            channel.send(str);
        }
        else {
            str = parseInt(data.slice(data.indexOf("\\"), data.length));
            let pres = {}
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
    });

    connection.once("close", () => {
        console.log("wise_server: connection from ", remoteAddress, " closed");
    });
    
    connection.on("error", err => {
        console.log("wise_server: connection ", remoteAddress, " error: ", err.message);
    });
}




//client socket handling
wise_client.on('data', data => {
	console.log(`wise_client: recieved "${data}"`);
    wise_client.destroy(); // kill wise_client after server's response
});

wise_client.on('error', e => {
    console.log(`wise_client: error: ${e.code}\n`);
    process.exit(1);
});

wise_client.on('close', () => {
	console.log('wise_client: closing');
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
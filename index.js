const { token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.commands = new Collection();

console.log('INFO - Loading commands.');
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

console.log('INFO - Syncing Database Models')
const modelsPath = path.join(__dirname, 'data/models');
const modelFiles = fs.readdirSync(modelsPath).filter(file => file.endsWith('.js'));

for (const file of modelFiles) {
	console.log(`INFO - Syncing Model ${file}`)
	const filePath = path.join(modelsPath, file);
	const model = require(filePath);
	// Sync database model
	model.data.sync({ alter: true })
}

console.log('INFO - Initializing Event Handlers')
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(token);
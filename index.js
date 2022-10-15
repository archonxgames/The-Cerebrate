//Imports
const { mongoDB, mongoHost, mongoPort, mongoUser, mongoPass } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const Sequelize = require('sequelize');
// const Keyv = require('keyv');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// const config = new Keyv(`mongodb://${mongoUser}:${mongoPass}@${mongoHost}:${mongoPort}/${mongoDB}`);

client.commands = new Collection();

console.log('Loading commands.');
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log(`INFO - ${client.user.tag} is now online.`);
});

// keyv.on('error', err => console.error('Keyv connection error:', err));

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand() && !interaction.isModalSubmit()) return;

	console.log(interaction);

	if (interaction.isCommand()) {
		const command = client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}

	if (interaction.isModalSubmit()) {
		try {
			switch (interaction.customId) {
				case "newProductionLog":
					const user = `<@${interaction.user.id}>`;
					const type = interaction.fields.getTextInputValue('type');
					const item = interaction.fields.getTextInputValue('item');
					const amount = interaction.fields.getTextInputValue('amount');
					const unit = interaction.fields.getTextInputValue('unit');
					console.log({ user, type, item, amount, unit });
					
					await interaction.reply({ content: `${user} has submitted **${amount} ${unit}s** of **${item}** to **${type}**.` });
					await interaction.followUp({ content: 'Your submission was received successfully. Thank you for your service!', ephemeral: true });
					break;
				default:
					return;
			}
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.login(token);
const { SlashCommandBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder } = require('@discordjs/builders');
const { TextInputStyle } = require('discord.js');
const Keyv = require('keyv');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dumblore')
		.addSubcommand(subcommand =>
			subcommand
				.setName('count')
				.setDescription('Shows the number of times Dumblore got called Dumbledore.'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('add')
				.setDescription('Increase the count by 1.')),
	async execute(interaction) {
		switch(interaction.options.getSubcommand()) {
			case 'count':
				await interaction.reply(`Dumblore has been called Dumbledore ${count} times since this command was made available.`)
				break
			case 'add':
				await interaction.reply(`Dumblore has now been called Dumbledore ${count} times since this command was made available.`)
				break
		}
	},
};
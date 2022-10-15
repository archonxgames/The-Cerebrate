const { SlashCommandBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder } = require('@discordjs/builders');
const { TextInputStyle } = require('discord.js');
const { mongoDB, mongoHost, mongoPort, mongoUser, mongoPass } = require('../config.json');
const Keyv = require('keyv');

// const configs = new Keyv(`mongodb://safAdmin:k8K4zzJS2k2IXB61@ac-8sn05tc-shard-00-02.sufg5hx.mongodb.net:27017/cerebrate`);
// configs.on('error', err => console.error('Keyv connection error:', err));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('production')
		.setDescription('This is a test for logi.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('sheet')
				.setDescription('Link the bot to a new google sheet')
				.addStringOption(option => 
					option
						.setName('id')
						.setDescription('The ID of the Google Sheet that the bot will interface with.')
						.setRequired(true)
				))
		.addSubcommand(subcommand =>
			subcommand
				.setName('new')
				.setDescription('Adds a new entry to the logi production log.')),
	async execute(interaction) {
		switch(interaction.options.getSubcommand()) {
			case 'sheet':
				const id = interaction.options.getString('id')
				await interaction.reply(`<@${interaction.user.id}> has linked the Cerebrate to the following Google Sheet: ${id}`)
				break
			case 'new':
				// Create the modal
				const modal = new ModalBuilder()
				.setCustomId('newProductionLog')
				.setTitle('New Production Log');

				// Add components to modal

				// Create the text input components
				const productionTypeInput = new TextInputBuilder()
					.setCustomId('type')
					.setLabel('Production Type')
					.setPlaceholder('SO-ST-001')
					.setRequired(true)
					.setStyle(TextInputStyle.Short);
				const itemTypeInput = new TextInputBuilder()
					.setCustomId('item')
					.setLabel('Type of Item')
					.setPlaceholder('Bmats')
					.setRequired(true)
					.setStyle(TextInputStyle.Short);
				const amountInput = new TextInputBuilder()
					.setCustomId('amount')
					.setLabel('Amount')
					.setPlaceholder('1')
					.setRequired(true)
					.setStyle(TextInputStyle.Short);
				const unitInput = new TextInputBuilder()
					.setCustomId('unit')
					.setLabel('Unit')
					.setPlaceholder('Single, Crate, Pallet')
					.setRequired(true)
					.setStyle(TextInputStyle.Short);

				const r1 = new ActionRowBuilder().addComponents(productionTypeInput);
				const r2 = new ActionRowBuilder().addComponents(itemTypeInput);
				const r3 = new ActionRowBuilder().addComponents(amountInput);
				const r4 = new ActionRowBuilder().addComponents(unitInput);

				// Add inputs to the modal
				modal.addComponents(r1, r2, r3, r4);
				
				await interaction.showModal(modal);
				break
		}
	},
};
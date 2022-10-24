const { SlashCommandBuilder } = require('@discordjs/builders');
const gapi = require('../utils/GSheetAPIUtils')
const { spreadsheetId } = require('../config.json')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('gsheet')
		.setDescription('Test google sheet')
		.addStringOption(option => option.setName('test').setDescription('Data to input').setRequired(false)),
	async execute(interaction) {
		const result = await gapi.getValues(spreadsheetId, 'A1')

		console.log('INFO - Data found: ', result)
		await interaction.reply({content: `Data found in gsheet: ${result}`, ephemeral: true});
	},
};
const { SlashCommandBuilder } = require('@discordjs/builders');
const gapi = require('../utils/GSheetAPIUtils')
const { spreadsheetId } = require('../config.json')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('gsheet')
		.setDescription('Test google sheet')
		.addStringOption(option => option.setName('test').setDescription('Data to input').setRequired(false)),
	async execute(interaction) {
		try {
			const range = `'Production Log'!A1`
			const result = await gapi.getValues(spreadsheetId, range)

			console.log('INFO - Data found: ', result)
			await interaction.reply({content: `Data found in gsheet: ${result.data.values}`, ephemeral: true});
		} catch (error) {
			console.error('ERROR - gsheet.js - Error trying to get data from google sheet\n', error)
			return await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true})
		}
	},
};
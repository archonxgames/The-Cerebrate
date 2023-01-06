const { SlashCommandBuilder } = require('@discordjs/builders');
const gapi = require('../../utils/GoogleAPIUtils')
const { spreadsheetId } = require('../../config.json')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('gsheet')
		.setDescription('Test google sheet')
		.addStringOption(option => option.setName('test').setDescription('Data to input').setRequired(false)),
	async execute(interaction) {
		try {
			const range = `'Production Log'`
			const values = [['SO-ST-01', 5, 'Bmats', 'Crate']]
			const result = await gapi.sheets.appendValues(spreadsheetId, range, 'USER_ENTERED', values)
			console.log('INFO - Data found: ', result)
			await interaction.reply({content: `Data found in gsheet: ${result.data.updates.updatedCells}`, ephemeral: true});
		} catch (error) {
			console.error('ERROR - gsheet.js - Error trying to get data from google sheet\n', error)
			return await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true})
		}
	},
};
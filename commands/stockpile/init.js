const StockpileSheet = require('../../data/models/StockpileSheet').data
const foxhole = require('../../utils/FoxholeAPIUtils')
const stockpile = require('../../utils/StockpileUtils')

module.exports = {
	async execute(interaction) {
		//Get the interaction data
		var guildId = interaction.guildId

		//Obtain current war data
		try {
			var warData = await foxhole.getWarData()

			var war = warData.warNumber
		} catch (error) {
			console.error('ERROR - init.js - Error obtaining current war data\n', error)
			return await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true})
		}
		
		//Generate a new google sheet based on current war data
		try {
			var sheetId = stockpile.createStockpileSheet(warData)
		} catch (error) {
			console.error('ERROR - init.js - Error generating google sheet\n', error)
			return await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true})
		}
		
		//Save google sheet link to database
		try {
			console.log(`INFO - Saving google sheet link to database.`)
			let url = `https://docs.google.com/spreadsheets/d/${sheetId}/edit?usp=sharing`
			
			await Tag.create({guildId, war, sheetUrl: url})
		} catch (error) {
			console.error('ERROR - init.js - Error saving google sheet link to database\n', error)
			return await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true})
		}
	}
}
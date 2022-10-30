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
			var sheetId = await stockpile.createStockpileSheet(warData)
		} catch (error) {
			console.error('ERROR - init.js - Error generating google sheet\n', error)
			return await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true})
		}
		
		//Save google sheet link to database
		try {
			console.log(`INFO - Saving google sheet link to database`)
			let url = `https://docs.google.com/spreadsheets/d/${sheetId}/edit?usp=sharing`
			
			await StockpileSheet.create({guildId, war, sheetUrl: url})
			console.log(`INFO - Stockpile successfully initialized`)
			return await interaction.reply({
				content: "The stockpile dashboard has been successfully created. To access the stockpile sheet, click on the link below.\n_ _",
				embeds: [
					{
						title: `War ${war} Stockpile Sheet`,
						description: 'Click on the link above to access the stockpile sheet. For a quick guide on how to use the sheet, <currently being created>.',
						url: url,
						color: '5078077'
					}
				]
			})
		} catch (error) {
			console.error('ERROR - init.js - Error saving google sheet link to database\n', error)
			return await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true})
		}
	}
}
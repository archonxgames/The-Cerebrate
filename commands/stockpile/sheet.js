const StockpileSheet = require('../../data/models/StockpileSheet').data
const foxhole = require('../../utils/FoxholeAPIUtils')

module.exports = {
	async execute(interaction) {
		//Get the interaction data
		const guildId = interaction.guildId
		let war = interaction.options.getInteger('war')
		
		//Obtain current war data if war parameter is not passed
		if (war == null) {
			try {
				console.log(`INFO - No 'war' parameter passed. Obtaining war data from Foxhole API.`)
				warData = await foxhole.getWarData()
				war = warData.warNumber
			} catch (error) {
				console.error('ERROR - sheet.js - Error obtaining current war data:\n', error)
				return await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true})
			}
		}

		//Retrieve gsheet id from database
		try {
			const result = await StockpileSheet.findOne({
				where: { guildId, war }
			})
	
			return await interaction.reply({
				embeds: [
				{
					title: `War ${war} Stockpile Sheet`,
					description: 'Click on the link above to access the stockpile sheet. For a quick guide on how to use the sheet, refer to the instructions found in the Dashboard.',
					url: `https://docs.google.com/spreadsheets/d/${result.sheetId}/edit?usp=sharing`,
					color: '5078077'
				}
			]})
		} catch (error) {
			console.error('ERROR - sheet.js - Error retrieving google sheet from database\n', error)
			return await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true})
		}
	}
}
const StockpileSheet = require('../../data/models/StockpileSheet').data
const foxhole = require('../../utils/FoxholeAPIUtils')

module.exports = {
	async execute(interaction) {
		//Get the interaction data
		const guildId = interaction.guild_id
		let war = interaction.options.getInteger('war')
		
		//Obtain current war data if war parameter is not passed
		if (war == null) {
			try {
				console.log(`INFO - No 'war' parameter passed. Obtaining war data from Foxhole API.`)
				war = foxhole.getWarData().warNumber
			} catch (error) {
				console.error('ERROR - sheet.js - Error obtaining current war data:\n', error)
			return await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true})
			}
		}

		//Retrieve gsheet link from database
		try {
			const result = await StockpileSheet.findOne({
				where: { guildId, war }
			})
	
			return await interaction.reply({content: `Link to the War ${war} stockpile sheet: ${result.sheetUrl}`})
		} catch (error) {
			console.error('ERROR - sheet.js - Error retrieving google sheet from database\n', error)
			return await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true})
		}
	}
}
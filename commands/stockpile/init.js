const { PermissionFlagsBits } = require('discord.js')
const StockpileSheet = require('../../data/models/StockpileSheet').data
const foxhole = require('../../utils/FoxholeAPIUtils')
const stockpile = require('../../utils/StockpileUtils')

module.exports = {
	async execute(interaction) {
		//Do a permission check
		if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageGuild)) {
			return await interaction.reply({ content: 'Sorry, you do not have the required permissions to use this feature. If you think this is a mistake, please contact your server administrator.', ephemeral: true})
		}
		
		//Defer the reply
		await interaction.deferReply()

		//Get the interaction data
		let guildId = interaction.guildId

		//Obtain current war data	
		try {
			var warData = await foxhole.getWarData()
			var war = warData.warNumber
		} catch (error) {
			console.error('ERROR - init.js - Error obtaining current war data\n', error)
			return await interaction.editReply({content: 'There was an error while executing this command!', ephemeral: true})
		}
		
		//Check for duplicate entries in the database
		const result = await StockpileSheet.findOne({
			where: { guildId, war }
		})
		
		if (result != null) {
			return await interaction.editReply({content: 'You have already initialized a stockpile dashboard for this war. Please use the `/stockpile sheet` to access the corresponding stockpile sheet.', ephemeral: true})
		}

		//Generate a new google sheet based on current war data
		try {
			var sheetId = await stockpile.createStockpileSheetFromTemplate(warData)
		} catch (error) {
			console.error('ERROR - init.js - Error generating google sheet\n', error)
			return await interaction.editReply({content: 'There was an error while executing this command!', ephemeral: true})
		}
		
		//Save google sheet link to database
		try {
			var url = `https://docs.google.com/spreadsheets/d/${sheetId}/edit?usp=sharing`
			console.log(`INFO - Saving google sheet link to database\n`, url)
			
			await StockpileSheet.create({guildId, war, sheetUrl: url})
		} catch (error) {
			console.error('ERROR - init.js - Error saving google sheet link to database\n', error)
			return await interaction.editReply({content: 'There was an error while executing this command!', ephemeral: true})
		}

		console.log(`INFO - Stockpile successfully initialized`)
		return await interaction.editReply({
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
	}
}
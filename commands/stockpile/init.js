const { PermissionFlagsBits } = require('discord.js')
const StockpileSheet = require('../../data/models/StockpileSheet').data
const GuildSetting = require('../../data/models/GuildSetting').data
const foxhole = require('../../utils/FoxholeAPIUtils')
const stockpile = require('../../utils/StockpileUtils')

module.exports = {
	async execute(interaction) {
		//Do a permission check
		if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageGuild)) {
			return await interaction.reply({ content: 'Sorry, you do not have the required permissions to use this feature. If you think this is a mistake, please contact your server administrator.', ephemeral: true})
		}
		
		//Defer the reply
		await interaction.deferReply({ ephemeral: true })

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

		try {
			//Obtain guild settings
			var guildSettings = await GuildSetting.findOne({
				where: { guildId }
			})
			
			//Return a message to set-up the regiment tag if guildSettings or tag does not exist
			if(guildSettings == null || guildSettings.tag == null) {
				return await interaction.editReply({content: 'You have not yet set your regiment tag. Please set your regiment tag using `/regiment tag` before executing this command again.'})
			}
		} catch (error) {
			console.error('ERROR - init.js - Error obtaining current war data\n', error)
			return await interaction.editReply({content: 'There was an error while executing this command!', ephemeral: true})
		}

		//Check for duplicate entries in the database
		try {
			const result = await StockpileSheet.findOne({
				where: { guildId, war }
			})
			
			if (result != null) {
				return await interaction.editReply({content: 'You have already initialized a stockpile dashboard for this war. Please use the `/stockpile sheet` command to access the corresponding stockpile sheet.', ephemeral: true})
			}
		} catch (error) {
			console.error('ERROR - init.js - Error checking duplicate entries in database\n', error)
			return await interaction.editReply({content: 'There was an error while executing this command!', ephemeral: true})
		}

		//Generate a new google sheet based on current war data
		try {
			var sheetId = await stockpile.createStockpileSheetFromTemplate(warData, guildSettings)
		} catch (error) {
			console.error('ERROR - init.js - Error generating google sheet\n', error)
			return await interaction.editReply({content: 'There was an error while executing this command!', ephemeral: true})
		}
		
		//Save google sheet link to database
		try {
			var url = `https://docs.google.com/spreadsheets/d/${sheetId}/edit?usp=sharing`
			console.log(`INFO - Saving google sheet id to database\n`, url)
			
			await StockpileSheet.create({guildId, war, sheetId})
		} catch (error) {
			console.error('ERROR - init.js - Error saving google sheet id to database\n', error)
			return await interaction.editReply({content: 'There was an error while executing this command!', ephemeral: true})
		}

		console.log(`INFO - Stockpile successfully initialized`)
		await interaction.channel.send({
			content: "The stockpile sheet has been successfully created. To access the stockpile sheet, click on the link below.\n_ _",
			embeds: [
				{
					title: `War ${war} Stockpile Sheet`,
					description: 'Click on the link above to access the stockpile sheet. For a quick guide on how to use the sheet, refer to the instructions found in the Dashboard.',
					url: url,
					color: '5078077'
				}
			]
		})

		return await interaction.editReply({content: "Command executed successfully.", ephemeral: true})
	}
}
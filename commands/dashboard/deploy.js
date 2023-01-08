const { PermissionFlagsBits } = require('discord.js')
const DashboardSetting = require('../../data/models/DashboardSetting').data
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
		let channel = interaction.options.getChannel('channel')

		//Obtain current war data
		let war = null
		try {
			var warData = await foxhole.getWarData()
			war = warData.warNumber
		} catch (error) {
			console.error('ERROR - deploy.js - Error obtaining current war data\n', error)
			return await interaction.editReply({content: 'There was an error while executing this command!', ephemeral: true})
		}

		//Get the latest stockpile sheet
		let sheetId = null
		try {
			const result = await StockpileSheet.findOne({
				where: { guildId, war }
			})

			if (result != null) {
				sheetId = result.sheetId
			} else {
				return await interaction.editReply({content: 'Cannot find a stockpile sheet for the current war. Please use the `/stockpile init` command to create a stockpile sheet.', ephemeral: true})
			}
		} catch (error) {
			console.error('ERROR - deploy.js - Error retrieving google sheet id from database\n', error)
			return await interaction.editReply({content: 'There was an error while executing this command!', ephemeral: true})
		}

		//Send Logi Dashboard message to channel
		try {
			let settings = await DashboardSetting.findOne({
				where: { guildId }
			})

			let message = (channel != null) ? 
				await channel.send(dashboard.write(settings.tag, settings.iconId, warNo, settings.color, now(), data))
			:
				await interaction.channel.send(dashboard.write(settings.tag, settings.iconId, warNo, settings.color, now(), data))
						
			//Save message to database for refreshing
			//Create settings if none exists
			if(settings == null) {
				settings = await DashboardSetting.create({guildId})
			} else {
				settings.dashboardMessageId = message.id
				await settings.save()
			}
			
		} catch (error) {
			console.error('ERROR - deploy.js - Error sending reply to logi dashboard channel\n', error)
			return await interaction.editReply({content: 'There was an error while executing this command!', ephemeral: true})
		}
	}
}

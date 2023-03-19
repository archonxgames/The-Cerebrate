const { PermissionFlagsBits } = require('discord.js')
const dashboard = require('../../components/messages/LogiDashboard')
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
		await interaction.deferReply({ ephemeral: true })

		//Get the interaction data
		let guildId = interaction.guildId
		let channel = interaction.options.getChannel('channel')

		//Obtain current war data
		try {
			let warData = await foxhole.getWarData()
			var war = warData.warNumber
		} catch (error) {
			console.error('ERROR - deploy.js - Error obtaining current war data\n', error)
			return await interaction.editReply({content: 'There was an error while executing this command!', ephemeral: true})
		}

		//Get the latest stockpile sheet
		try {
			const result = await StockpileSheet.findOne({
				where: { guildId, war }
			})

			if (result != null) {
				var sheetId = result.sheetId
			} else {
				return await interaction.editReply({content: 'Cannot find a stockpile sheet for the current war. Please use the `/stockpile init` command to create a stockpile sheet.', ephemeral: true})
			}
		} catch (error) {
			console.error('ERROR - deploy.js - Error retrieving google sheet id from database\n', error)
			return await interaction.editReply({content: 'There was an error while executing this command!', ephemeral: true})
		}

		//Get the logi dashboard data
		try {
			var data = await stockpile.getLogiDashboardData(sheetId)
			console.log('INFO - deploy.js - Retrieved data from stockpile sheet\n', data)
		} catch (error) {
			console.error('ERROR - deploy.js - Error retrieving logi dashboard data from stockpile sheet\n', error)
			return await interaction.editReply({content: 'There was an error while executing this command!', ephemeral: true})
		}

		//Send Logi Dashboard message to channel
		try {
			let settings = await DashboardSetting.findOne({
				where: { guildId }
			})

			//Create settings if none exists
			if(settings == null) {
				settings = await DashboardSetting.create({guildId})
			}
			
			//TODO: Replace with guild settings instead of dashboard settings
			let tag = (settings.tag != null) ? settings.tag : "SAF"
			let iconId = (settings.iconId != null) ? settings.iconId : "<:SAF1:1024375368712466482>"
			let color = (settings.color != null) ? settings.color : "5814783"
			let timestamp = new Date(Date.now()).toISOString()
			let message = (channel != null) ? 
				await channel.send(dashboard.write(tag, iconId, warNo, color, timestamp, data))
			:
				await interaction.channel.send(dashboard.write(tag, iconId, war, color, timestamp, data))
						
			//Save message to database for refreshing
			settings.dashboardMessageId = message.id
			settings.dashboardChannelId = interaction.channel.id
			await settings.save()

			return await interaction.editReply({content: 'Logistics dashboard has been deployed successfully.', ephemeral: true})
		} catch (error) {
			console.error('ERROR - deploy.js - Error sending reply to logi dashboard channel\n', error)
			return await interaction.editReply({content: 'There was an error while executing this command!', ephemeral: true})
		}
	}
}

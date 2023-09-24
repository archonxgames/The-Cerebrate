const dashboard = require('../../../components/dashboards/StockpileCodeDashboard')
const DashboardSetting = require('../../../data/models/DashboardSetting').data
const StockpileSheet = require('../../../data/models/StockpileSheet').data
const foxhole = require('../../../utils/FoxholeAPIUtils')
const stockpile = require('../../../utils/StockpileUtils')

module.exports = {
	async execute(interaction) {
		//Get the interaction data
		let guildId = interaction.guildId
		let channel = interaction.options.getChannel('channel')

		//Obtain current war data
		try {
			let warData = await foxhole.getWarData()
			var war = warData.warNumber
		} catch (error) {
			console.error('ERROR - stockpileCode.js - Error obtaining current war data\n', error)
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
			console.error('ERROR - stockpileCode.js - Error retrieving google sheet id from database\n', error)
			return await interaction.editReply({content: 'There was an error while executing this command!', ephemeral: true})
		}

		//Get the stockpile codes from sheet
		try {
			var data = await stockpile.getStockpileCodes(sheetId)
			console.log('INFO - stockpileCode.js - Retrieved data from stockpile sheet\n', data)
		} catch (error) {
			console.error('ERROR - stockpileCode.js - Error retrieving stockpile codes from stockpile sheet\n', error)
			return await interaction.editReply({content: 'There was an error while executing this command!', ephemeral: true})
		}

		//Send stockpile code dashboard message to channel
		try {
			let settings = await DashboardSetting.findOne({
				where: { guildId, type: "stockpileCode" }
			})

			//Create settings if none exists
			if(settings == null) {
				settings = await DashboardSetting.create({ guildId, type: "stockpileCode" })
			}
			
			//TODO: Replace with guild settings instead of dashboard settings
			let tag = (settings.tag != null) ? settings.tag : "SAF"
			let iconId = (settings.iconId != null) ? settings.iconId : "<:SAF1:1024375368712466482>"
			let timestamp = new Date(Date.now()).toISOString()
			let message = (channel != null) ? 
				await channel.send(dashboard.write(tag, iconId, warNo, timestamp, data))
			:
				await interaction.channel.send(dashboard.write(tag, iconId, war, timestamp, data))
						
			//Save message to database for refreshing
			settings.dashboardMessageId = message.id
			settings.dashboardChannelId = interaction.channel.id
			await settings.save()

			return await interaction.editReply({content: 'Stockpile code dashboard has been deployed successfully.', ephemeral: true})
		} catch (error) {
			console.error('ERROR - stockpileCode.js - Error sending reply to stockpile code dashboard channel\n', error)
			return await interaction.editReply({content: 'There was an error while executing this command!', ephemeral: true})
		}
	}
}

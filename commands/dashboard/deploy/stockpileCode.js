const dashboard = require('../../../components/dashboards/StockpileCodeDashboard')
const GuildSetting = require('../../../data/models/GuildSetting').data
const DashboardSetting = require('../../../data/models/DashboardSetting').data
const StockpileSheet = require('../../../data/models/StockpileSheet').data
const foxhole = require('../../../utils/FoxholeAPIUtils')
const Logger = require('../../../utils/Logger')
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
			Logger.error('stockpileCode.js','execute','Error obtaining current war data', error)
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
			Logger.error('stockpileCode.js','execute','Error retrieving google sheet id from database', error)
			return await interaction.editReply({content: 'There was an error while executing this command!', ephemeral: true})
		}

		//Get the stockpile codes from sheet
		try {
			var data = await stockpile.getStockpileCodes(sheetId)
			Logger.debug('stockpileCode.js','execute','Retrieved data from stockpile sheet', data)
		} catch (error) {
			Logger.error('stockpileCode.js','execute','Error retrieving stockpile codes from stockpile sheet', error)
			return await interaction.editReply({content: 'There was an error while executing this command!', ephemeral: true})
		}

		//Send stockpile code dashboard message to channel
		try {
			//Get guild settings
			let guildSettings = await GuildSetting.findOne({
				where: { guildId }
			})
			
			//Create settings if none exists
			if(guildSettings == null) {
				guildSettings = await GuildSetting.create({guildId})
			}
			
			let tag = (guildSettings.tag != null) ? guildSettings.tag : "SAF"
			let iconId = (guildSettings.iconId != null) ? guildSettings.iconId : "<:SAF1:1024375368712466482>"
			let color = 0xa7ba6c
			let timestamp = new Date(Date.now()).toISOString()

			let message = (channel != null) ? 
				await channel.send(dashboard.write(tag, iconId, war, color, timestamp, data))
			:
				await interaction.channel.send(dashboard.write(tag, iconId, war, color, timestamp, data))
						
			//Save message to database for refreshing
			await DashboardSetting.create({
				guildId,
				type: 'stockpileCode',
				dashboardMessageId: message.id,
				dashboardChannelId: (channel != null) ? channel.id : interaction.channel.id
			})

			return await interaction.editReply({content: 'Stockpile code dashboard has been deployed successfully.', ephemeral: true})
		} catch (error) {
			console.error('ERROR - stockpileCode.js - Error sending reply to stockpile code dashboard channel\n', error)
			return await interaction.editReply({content: 'There was an error while executing this command!', ephemeral: true})
		}
	}
}

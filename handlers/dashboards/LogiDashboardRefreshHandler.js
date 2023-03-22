const foxhole = require('../../utils/FoxholeAPIUtils')
const dashboard = require('../../components/messages/LogiDashboard')
const GuildSetting = require('../../data/models/GuildSetting').data
const DashboardSetting = require('../../data/models/DashboardSetting').data
const StockpileUtils = require('../../utils/StockpileUtils')
const StockpileSheet = require('../../data/models/StockpileSheet').data

/**
 * Refreshes an existing dashboard using DashboardSetting fields
 * @param {DashboardSetting} dashboardSettings The settings of a logi dashboard
 */
async function refreshExisting(client, dashboardSettings) {
	//Save guildId to a variable since Sequelize doesnt like direct references to the parameter
	var guildId = dashboardSettings.guildId

	//Locate channel where the logi dashboard is
	try {
		const channel = await client.guilds.cache.get(guildId).channels.cache.get(dashboardSettings.dashboardChannelId)
		var message = await channel.messages.fetch(dashboardSettings.dashboardMessageId)
	} catch(error) {
		return console.error('ERROR - LogiDashboardRefreshHandler.js - Error locating dashboard channel\n', error)
	}

	//Obtain current war data
	try {
		let warData = await foxhole.getWarData()
		var war = warData.warNumber
	} catch (error) {
		console.error('ERROR - LogiDashboardRefreshHandler.js - Error obtaining current war data\n', error)
		return await message.edit({content: 'There was an error while refreshing the dashboard!'})
	}

	//Get the latest stockpile sheet
	try {
		const result = await StockpileSheet.findOne({
			where: { guildId, war }
		})

		if (result != null) {
			var sheetId = result.sheetId
		} else {
			return console.log('INFO - LogiDashboardRefreshHandler.js - Cannot locate latest copy of stockpile sheet; cancelling operation')
		}
	} catch (error) {
		console.error('ERROR - LogiDashboardRefreshHandler.js - Error retrieving google sheet id from database\n', error)
		return await message.edit({content: 'There was an error while refreshing the dashboard!'})
	}

	//Get the logi dashboard data
	try {
		var data = await StockpileUtils.getLogiDashboardData(sheetId)
		console.log('INFO - LogiDashboardRefreshHandler.js - Retrieved data from stockpile sheet\n', data)
	} catch (error) {
		console.error('ERROR - LogiDashboardRefreshHandler.js - Error retrieving logi dashboard data from stockpile sheet\n', error)
		return await message.edit({content: 'There was an error while refreshing the dashboard!'})
	}

	//Update Logi Dashboard message to channel
	try {
		//Get guild settings
		var guildSettings = await GuildSetting.findOne({
			where: { guildId }
		})
		
		//Create settings if none exists
		if(guildSettings == null) {
			guildSettings = await GuildSetting.create({guildId})
		}

		//TODO: Replace with guild settings instead of dashboard settings
		let tag = (guildSettings.tag != null) ? guildSettings.tag : "SAF"
		let iconId = (guildSettings.iconId != null) ? guildSettings.iconId : "<:SAF1:1024375368712466482>"
		let color = (dashboardSettings.color != null) ? dashboardSettings.color : 0xa7ba6c
		let timestamp = new Date(Date.now()).toISOString()
		let content = dashboard.write(tag, iconId, war, color, timestamp, data)

		await message.edit(content)
		console.log('INFO - LogiDashboardRefreshHandler.js - Logi dashboard refreshed successfully')
	} catch (error) {
		console.error('ERROR - LogiDashboardRefreshHandler.js - Error sending reply to logi dashboard channel\n', error)
		return await message.edit({content: 'There was an error while refreshing the dashboard!'})
	}
}

module.exports = {
	async execute(interaction) {
		//Defer the interaction
		if (interaction.isButton()) {
			interaction.deferUpdate()
		} else {
			interaction.deferReply({ephemeral: true})
		}

		//Get the interaction data
		let guildId = interaction.guildId

		//Obtain current war data
		try {
			let warData = await foxhole.getWarData()
			var war = warData.warNumber
		} catch (error) {
			console.error('ERROR - LogiDashboardRefreshHandler.js - Error obtaining current war data\n', error)
			return await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true})
		}

		//Get the latest stockpile sheet
		try {
			const result = await StockpileSheet.findOne({
				where: { guildId, war }
			})

			if (result != null) {
				var sheetId = result.sheetId
			} else {
				return await interaction.reply({content: 'Cannot find a stockpile sheet for the current war. Please use the `/stockpile init` command to create a stockpile sheet.', ephemeral: true})
			}
		} catch (error) {
			console.error('ERROR - LogiDashboardRefreshHandler.js - Error retrieving google sheet id from database\n', error)
			return await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true})
		}

		//Get the logi dashboard data
		try {
			var data = await StockpileUtils.getLogiDashboardData(sheetId)
			console.log('INFO - LogiDashboardRefreshHandler.js - Retrieved data from stockpile sheet\n', data)
		} catch (error) {
			console.error('ERROR - LogiDashboardRefreshHandler.js - Error retrieving logi dashboard data from stockpile sheet\n', error)
			return await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true})
		}

		//Update Logi Dashboard message to channel
		try {
			//Get dashboard settings
			var dashboardSettings = await DashboardSetting.findOne({
				where: { guildId }
			})
			
			//Create settings if none exists
			if(dashboardSettings == null) {
				dashboardSettings = await DashboardSetting.create({guildId})
			}

			//Get guild settings
			var guildSettings = await GuildSetting.findOne({
				where: { guildId }
			})
			
			//Create settings if none exists
			if(guildSettings == null) {
				guildSettings = await GuildSetting.create({guildId})
			}

			//TODO: Replace with guild settings instead of dashboard settings
			let tag = (guildSettings.tag != null) ? guildSettings.tag : "SAF"
			let iconId = (guildSettings.iconId != null) ? guildSettings.iconId : "<:SAF1:1024375368712466482>"
			let color = (dashboardSettings.color != null) ? dashboardSettings.color : 0xa7ba6c
			let timestamp = new Date(Date.now()).toISOString()
			let message = dashboard.write(tag, iconId, war, color, timestamp, data)

			if(interaction.isButton()) {
				return await interaction.editReply(message)
			} else {
				let channel = await interaction.guild.channels.fetch(dashboardSettings.dashboardChannelId)
				await channel.messages.edit(dashboardSettings.dashboardMessageId, message)
				return await interaction.editReply({content: 'Logistics dashboard has been refreshed successfully.', ephemeral: true})
			}
		} catch (error) {
			console.error('ERROR - LogiDashboardRefreshHandler.js - Error sending reply to logi dashboard channel\n', error)
			return await interaction.editReply({content: 'There was an error while executing this command!', ephemeral: true})
		}
	},

	async executeInterval(client) {
		try {
			//Get dashboard settings
			var dashboardSettings = await DashboardSetting.findAll()

			dashboardSettings.forEach((dashboardSetting) => {
				refreshExisting(client, dashboardSetting)
			})
		} catch(error) {
			console.error('ERROR - LogiDashboardRefreshHandler.js - Error retrieving DashboardSetting data\n', error)
		}
	}
}
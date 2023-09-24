const foxhole = require('../../utils/FoxholeAPIUtils')
const dashboard = require('../../components/dashboards/LogiDashboard')
const GuildSetting = require('../../data/models/GuildSetting').data
const DashboardSetting = require('../../data/models/DashboardSetting').data
const StockpileUtils = require('../../utils/StockpileUtils')
const LogiDashboardRefreshHandler = require('./LogiDashboardRefreshHandler')
const StockpileCodeDashboardRefreshHandler = require('./StockpileCodeDashboardRefreshHandler')
const StockpileSheet = require('../../data/models/StockpileSheet').data
const Logger = require('../../utils/Logger')

/**
 * Redirects the refresh procedure of a dashboard based on its type
 * @param {DashboardSetting} settings The settings of a dashboard
 */
async function handleRefresh(settings) {
	switch(settings.type) {
		case 'logiOrder': return LogiDashboardRefreshHandler.refresh(settings)
		case 'stockpileCode': return StockpileCodeDashboardRefreshHandler.refresh(settings)
	}
}

/**
 * Refreshes a dashboard using DashboardSetting fields
 * @param {DashboardSetting} settings The settings of a dashboard
 */
async function refreshFromClient(client, settings) {
	//Save guildId to a variable since Sequelize doesnt like direct references to the parameter
	var guildId = settings.guildId

	//Locate channel where the logi dashboard is
	try {
		const channel = await client.guilds.cache.get(guildId).channels.cache.get(settings.dashboardChannelId)
		var message = await channel.messages.fetch(settings.dashboardMessageId)
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
		let color = (settings.color != null) ? settings.color : 0xa7ba6c
		let timestamp = new Date(Date.now()).toISOString()
		let content = dashboard.write(tag, iconId, war, color, timestamp, data)

		await message.edit(content)
		console.log('INFO - LogiDashboardRefreshHandler.js - Logi dashboard refreshed successfully')
	} catch (error) {
		console.error('ERROR - LogiDashboardRefreshHandler.js - Error sending reply to logi dashboard channel\n', error)
		return await message.edit({content: 'There was an error while refreshing the dashboard!'})
	}
}

async function refreshFromButton(messageId) {
	//Get dashboard settings
	try {
		var settings = await DashboardSetting.findOne({
			where: { dashboardMessageId: messageId}
		})

		//Return an invalid response if settings do not exist
		if(settings == null) {
			Logger.info(`DashboardRefreshHandler.js`, 'refreshFromButton', 'Dashboard settings not found from given messageId')
			return await 'Dashboard cannot be refreshed due to an unexpected issue. Please contact your administrator if you think this is a mistake.'
		}
	} catch (error) {
		Logger.error(`DashboardRefreshHandler.js`, 'refreshFromButton', 'Error retrieving dashboard settings', error)
		throw(error)
	}

	//Refresh corresponding dashboard
	try {
		var result = await handleRefresh(settings)
		return result.message
	} catch (error) {
		Logger.error(`DashboardRefreshHandler.js`, 'refreshFromButton', 'Error refreshing dashboard', error)
		throw(error)
	}
}

async function refreshFromCommand(messageId) {
	//Get the message id from the command options
	//Get dashboard settings
	try {
		var settings = await DashboardSetting.findOne({
			where: { dashboardMessageId: messageId}
		})

		//Return an invalid response if settings do not exist
		if(settings == null) {
			Logger.info(`DashboardRefreshHandler.js`, 'refreshFromCommand', 'Dashboard settings not found from given messageId')
			return await 'Dashboard cannot be refreshed due to an unexpected issue. Please contact your administrator if you think this is a mistake.'
		}
	} catch (error) {
		Logger.error(`DashboardRefreshHandler.js`, 'refreshFromCommand', 'Error retrieving dashboard settings', error)
		throw(error)
	}

	//Refresh corresponding dashboard
	try {
		var result = await handleRefresh(settings)

		//Respond to interaction
		let channel = await interaction.guild.channels.fetch(dashboardSettings.dashboardChannelId)
		await channel.messages.edit(dashboardSettings.dashboardMessageId, result.message)

		return result.content
	} catch (error) {
		Logger.error(`DashboardRefreshHandler.js`, 'refreshFromCommand', 'Error refreshing dashboard', error)
		throw(error)
	}
	
	//TODO: return a response coming from handler
	// return 'Dashboard has been refreshed successfully.'
}

module.exports = {
	/**
	 * Refreshes a dashboard based from an interaction
	 */
	async refresh(interaction) {
		try {
			if (interaction.isButton()) {
				interaction.deferUpdate()
				let response = await refreshFromButton(interaction.message.id)
				return await interaction.editReply(response)
			} else {
				interaction.deferReply({ephemeral: true})
				let messageId = interaction.getString('message-id')
				let response = await refreshFromCommand(messageId)
				return await interaction.editReply({content: response, ephemeral: true})
			}
		} catch (error) {
			Logger.error(`DashboardRefreshHandler.js`, 'refresh', 'Error sending reply to logi dashboard channel', error)
			return await interaction.editReply({content: 'There was an error while executing this command!', ephemeral: true})
		}
	},

	/**
	 * Refreshes all existing dashboards in all guilds
	 * @param {*} client 
	 */
	async refreshAll(client) {
		try {
			//Get dashboard settings
			var dashboardSettings = await DashboardSetting.findAll()

			dashboardSettings.forEach((dashboardSetting) => {
				refreshExisting(client, dashboardSetting)
			})
		} catch(error) {
			console.error('ERROR - DashboardRefreshHandler.js - Error retrieving DashboardSetting data\n', error)
		}
	}
}
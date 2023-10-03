const DashboardSetting = require('../../data/models/DashboardSetting').data
const LogiDashboardRefreshHandler = require('./LogiDashboardRefreshHandler')
const StockpileCodeDashboardRefreshHandler = require('./StockpileCodeDashboardRefreshHandler')
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
				
				//Respond to interaction
				let channel = await interaction.guild.channels.fetch(dashboardSettings.dashboardChannelId)
				await channel.messages.edit(dashboardSettings.dashboardMessageId, result.message)
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

			dashboardSettings.forEach(async (dashboardSetting) => {
				let guildId = dashboardSetting.guildId
				let channel = await client.guilds.cache.get(guildId).channels.cache.get(dashboardSetting.dashboardChannelId)
				let message = await channel.messages.fetch(dashboardSetting.dashboardMessageId)
				let result = await handleRefresh(dashboardSetting)
				return await message.edit(result.message)
			})
		} catch(error) {
			Logger.error('DashboardRefreshHandler.js', 'refreshAll', 'Error refreshing all dashboards', error)
		}
	}
}
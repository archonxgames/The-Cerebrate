const { PermissionFlagsBits } = require('discord.js')
const ProductionSetting = require('../../data/models/ProductionSetting').data

module.exports = {
	async execute(interaction) {
		//Do a permission check
		if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageChannels)) {
			return interaction.reply({ content: 'Sorry, you do not have the required permissions to use this feature. If you think this is a mistake, please contact your server administrator.', ephemeral: true})
		}

		//Get the interaction data
		const channel = interaction.options.getChannel('channel')
		const guildId = interaction.guildId
		
		//Save channel id to database
		try {
			console.log(`INFO - Saving channel to database\n`, channel)
			let settings = await ProductionSetting.findOne({
				where: { guildId }
			})

			//Create settings if none exists
			if(settings == null) {
				settings = await ProductionSetting.create({guildId})
			} else {
				settings.logChannelId = channel.id
				await settings.save()
			}

			return interaction.reply({content: 'Production log channel successfully set.', ephemeral: true})
		} catch (error) {
			console.error('ERROR - log.js - Error trying to save channel id to database\n', error)
			return interaction.reply({content: 'There was an error while executing this command!', ephemeral: true})
		}
	}
}
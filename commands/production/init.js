const { ActionRowBuilder, SelectMenuBuilder } = require('@discordjs/builders')
const { PermissionFlagsBits } = require('discord.js')
const { clientId } = require('../../config.json')

module.exports = {
	async execute(interaction) {
		//Do a permission check
		if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageMessages)) {
			return await interaction.reply({ content: 'Sorry, you do not have the required permissions to use this feature. If you think this is a mistake, please contact your server administrator.', ephemeral: true})
		}

		//Get the interaction data
		const messageId = interaction.options.getString('message-id')
		const useExisting = interaction.options.getBoolean('use-existing')
		const channel = interaction.channel
		
		//Look for the message if messageId is not null
		var message = null
		if (messageId) {
			try {
				message = await channel.messages.fetch(messageId)
				console.log('INFO - Fetched message from message ID\n', message)
			} catch (error) {
				await interaction.reply({ content: 'An error occurred while fetching the referenced message. Please try again.', ephemeral: true })
				return console.error('ERROR - init.js - Failed to fetch message\n', error)
			}
		}

		//Look for usable webhooks if useExisting flag is true
		var webhook = null
		if (useExisting) {
			try {
				const webhooks = await channel.fetchWebhooks()
				webhook = webhooks.find(wh => wh.owner.id == clientId)
				
				if (webhook != null) {
					console.log('INFO - Fetched webhook from known webhooks in channel\n', webhook)
				} else {
					return await interaction.reply({content: 'No usable webhook found. Please try again.', ephemeral: true})
				}
			} catch (error) {
				await interaction.reply({ content: 'Failed to fetch a usable webhook. Please try again.', ephemeral: true })
				return console.error('ERROR - init.js - Failed to fetch webhook\n', error)
			}
		} else {
			try {
				webhook = await channel.createWebhook({
					name: 'The Quartermaster',
					avatar: 'https://cdn.discordapp.com/attachments/864473042033836052/1032961929913831475/techpriest.png',
				})
				console.log('INFO - New webhook generated\n', webhook)
			} catch (error) {
				return console.error('ERROR - init.js - Failed to generate webhook\n', error)
			}
		}
		
		if (webhook == null) { return await interaction.reply({ content: 'Failed to obtain or generate a valid webhook. Please try again.', ephemeral: true })}

		console.log('INFO - Webhook initialized\n', webhook)
		
		const row = new ActionRowBuilder()
			.addComponents(
				new SelectMenuBuilder()
					.setCustomId('production-log-type')
					.setPlaceholder('Select a Production Log Entry')
					.addOptions(
						{
							label: 'Submit to Stockpile',
							description: 'Submit items into a stockpile.',
							value: 'submit',
						},
						{
							label: 'Transfer to Stockpile',
							description: 'Transfer items between stockpiles.',
							value: 'transfer',
						},
					)
			)

		try {
			await webhook.send({
				content: message.content || 'Edit this message!',
				components: [row],
				embeds: message.embeds || []
			})

			await interaction.reply({content: 'Production log message created. Use https://discohook.org to edit the webhook message.', ephemeral: true})
		} catch (error) {
			return console.error('ERROR - init.js - Error trying to send a message', error)
		}
	}
}
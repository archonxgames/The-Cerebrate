module.exports = {
	type: 'interactionCreate',
	async execute(interaction) {
		if (!interaction.isCommand()) return

		console.log(interaction)
		
		const command = interaction.client.commands.get(interaction.commandName)

		if (!command) return

		try {
			await command.execute(interaction)
		} catch (error) {
			console.error('ERROR - CommandEventHandler.js - There was an error while executing this command',error)
			interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true }).error((e) => {
				console.log('ERROR - CommandEventHandler.js - There was an error replying to the interaction',error)
				interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true }).error((e) => {
					console.log('ERROR - CommandEventHandler.js - There was an error editing the reply of the interaction',error)
				})
			})
		}
	}
}
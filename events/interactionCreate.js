const SubmitItemModal = require('../components/modals/ProductionSubmitLogModal')
const TransferItemModal = require('../components/modals/ProductionTransferLogModal')

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		if (!interaction.isCommand() && !interaction.isModalSubmit() && !interaction.isSelectMenu() && !interaction.isButton()) return

		console.log(interaction)

		if (interaction.isCommand()) {
			const command = interaction.client.commands.get(interaction.commandName)

			if (!command) return

			try {
				await command.execute(interaction)
			} catch (error) {
				console.error(error)
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
			}
		}

		if (interaction.isModalSubmit()) {
			try {
				switch (interaction.customId) {
					case "newProductionSubmitLog":
						return await SubmitItemModal.execute(interaction)
					case "newProductionTransferLog":
						return await TransferItemModal.execute(interaction)
					default:
						return
				}
			} catch (error) {
				console.error(error)
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
			}
		}

		if (interaction.isSelectMenu()) {
			if (interaction.customId === 'production-log-type') {
				switch(interaction.values[0]) {
					case 'submit':
						return await interaction.showModal(SubmitItemModal.modal)
					case 'transfer':
						return await interaction.showModal(TransferItemModal.modal)
					default:
						return
				}
			}
		}
	}
}
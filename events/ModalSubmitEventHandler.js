const SubmitItemModal = require('../components/modals/ProductionSubmitLogModal')
const TransferItemModal = require('../components/modals/ProductionTransferLogModal')

module.exports = {
	type: 'interactionCreate',
	async execute(interaction) {
		if (!interaction.isModalSubmit()) return

		console.log(interaction)

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
			console.log('ERROR - ModalSubmitEventHandler.js - There was an error during modal submission',error)
			interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true }).error((e) => {
				console.log('ERROR - ModalSubmitEventHandler.js - There was an error replying to the interaction',error)
				interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true }).error((e) => {
					console.log('ERROR - ModalSubmitEventHandler.js - There was an error editing the reply of the interaction',error)
				})
			})
		}
	}
}
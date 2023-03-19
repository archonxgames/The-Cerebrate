const SubmitItemModal = require('../components/modals/ProductionSubmitLogModal')
const TransferItemModal = require('../components/modals/ProductionTransferLogModal')

module.exports = {
	type: 'interactionCreate',
	async execute(interaction) {
		if (!interaction.isSelectMenu()) return

		console.log(interaction)

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
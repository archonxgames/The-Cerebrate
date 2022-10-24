const SubmitItemModal = require('../../components/modals/ProductionSubmitLogModal')
const TransferItemModal = require('../../components/modals/ProductionTransferLogModal')

module.exports = {
	async execute(interaction) {
		//Get the interaction data
		const type = interaction.options.getString('type')
		
		//Look for the message if messageId is not null
		try {
			switch(type) {
				case 'transfer':
					await interaction.showModal(TransferItemModal.modal)
					break
				case 'submit':
				default:
					return await interaction.showModal(SubmitItemModal.modal)
			}
		} catch (error) {
			return console.error('ERROR - new.js - Error trying to send modal', error)
		}
	}
}
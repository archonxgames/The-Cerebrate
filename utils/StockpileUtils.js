const gapi = require('./GoogleAPIUtils')
const { folderId, templSheetId } = require('../config.json')

module.exports = {
	async createStockpileSheetFromTemplate(warData, guildSettings) {
		//Copy file from template
		let title = `${guildSettings.tag} - War ${warData.warNumber} - Logistics`
		let sheetId = await gapi.drive.copyFileToFolder(folderId, templSheetId, title)

		//Populate stockpile sheet with default values from guild settings
		await this.populateStockpileSheet(sheetId, guildSettings)
		
		//Share the file
		await gapi.drive.shareFileToPublic(sheetId)
		
		return sheetId
	},

	async populateStockpileSheet(spreadsheetId, guildSettings) {
		const range = 'Settings!C1'
		const values = [[guildSettings.tag]]
		const data = await gapi.sheets.updateValues(spreadsheetId, range, 'USER_ENTERED', values)

		return data.data.values
	},

	async getLogiDashboardData(sheetId) {
		const data = await gapi.sheets.getValues(sheetId, `'Logi Order'!E5:V10`)

		return data.data.values
	}
}
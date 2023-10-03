const gapi = require('./GoogleAPIUtils')
const { folderId, templSheetId } = require('../config.json')

async function populateStockpileSheet(spreadsheetId, guildSettings) {
	const range = 'Settings!C1'
	const values = [[guildSettings.tag]]
	const data = await gapi.sheets.updateValues(spreadsheetId, range, 'USER_ENTERED', values)

	return data.data.values
}

module.exports = {
	async createStockpileSheetFromTemplate(warData, guildSettings) {
		//Copy file from template
		let title = `${guildSettings.tag} - War ${warData.warNumber} - Logistics`
		let sheetId = await gapi.drive.copyFileToFolder(folderId, templSheetId, title)

		//Populate stockpile sheet with default values from guild settings
		await populateStockpileSheet(sheetId, guildSettings)
		
		//Share the file
		await gapi.drive.shareFileToPublic(sheetId)
		
		return sheetId
	},

	async getLogiDashboardData(sheetId) {
		const data = await gapi.sheets.getValues(sheetId, `'Logi Order'!E5:S10`)

		return data.data.values
	},

	async getStockpileCodes(sheetId) {
		const data = await gapi.sheets.getValues(sheetId, `'Settings'!H1:5`)

		return data.data.values
	}
}
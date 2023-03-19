const gapi = require('./GoogleAPIUtils')
const { folderId, templSheetId } = require('../config.json')

module.exports = {
	async createStockpileSheetFromTemplate(warData) {
		//Copy file from template
		let title = `War ${warData.warNumber} - Logistics`
		let sheetId = await gapi.drive.copyFileToFolder(folderId, templSheetId, title)
		
		//Share the file
		await gapi.drive.shareFileToPublic(sheetId)
		
		return sheetId
	},

	async getLogiDashboardData(sheetId) {
		const data = await gapi.sheets.getValues(sheetId, `'Logi Order'!E5:V10`)

		return data.data.values
	}
}
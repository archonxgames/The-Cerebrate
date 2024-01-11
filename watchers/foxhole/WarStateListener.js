const Tag = require('../../data/models/Tag').data
const foxhole = require('../../utils/FoxholeAPIUtils')
const Logger = require('../../utils/Logger')

module.exports = {
	async subscribe() {
		Logger.info('WarStateListener.js','subscribe',`START - Checking for updates for Foxhole War State`)
		try {
			Logger.info('WarStateListener.js','subscribe',`Retrieving Foxhole War Data`)
			var warData = await foxhole.getWarData()

			const tag = await Tag.findOne({
				where: {
					tag: 'war'
				}
			})

			if (!tag) {
				Logger.info('WarStateListener.js','subscribe',`Tag 'war' does not exist. Creating new tag.`)
				await Tag.create({tag: "war", count: warData.warNumber})
				Logger.info('WarStateListener.js','subscribe',`Tag 'war' created successfully.`)
			} else if(tag != warData.warNumber) {
				return true
			}
			return false
		} catch (error) {
			console.error('ERROR - init.js - Error obtaining current war data\n', error)
		}
		Logger.info('WarStateListener.js','subscribe',`END - Checking for updates for Foxhole War State`)
	}
}
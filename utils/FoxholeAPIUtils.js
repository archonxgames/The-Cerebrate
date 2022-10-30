const axios = require('axios')
const basepath = 'https://war-service-live.foxholeservices.com/api'

module.exports = {
async getWarData() {
	let endpoint = '/worldconquest/war'
	let result = null

	try {
		result = await axios.get(`${basepath}${endpoint}`)
		console.log('INFO - Foxhole war data retrieved result\n', result.data)
	} catch(error) {
		console.error('ERROR - FoxholeAPIUtils.js - Unable to retrieve war data from foxhole api\n', error)
		throw(error)
	}

	return result.data
}
}
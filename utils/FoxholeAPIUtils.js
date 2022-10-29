const http = require('https')
const basepath = 'https://war-service-live.foxholeservices.com/'



module.exports = {
	async getWarData() {
		let endpoint = 'worldconquest/war'
		http.get(basepath + endpoint, (response) => {
			let result = null
	
			response.on('data', function (data) {
					result = JSON.parse(data)
			})
	
			response.on('end', function () {
					console.log('INFO - Foxhole war data retrieved result\n', result)
			})
		})
	}
}
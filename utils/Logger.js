module.exports = {
	level: {
		DEBUG: 'DEBUG',
		INFO: 'INFO',
		ERROR: 'ERROR'
	},
	info(file, method, message) {
		console.log(`${this.level.INFO}: ${file} - ${method}() - ${message}`)
	},
	debug(file, method, message, payload) {
		console.debug(
			`${this.level.DEBUG}: ${file} - ${method}() - ${message}`,'\n',
			'--PAYLOAD START--','\n',
			payload,'\n',
			'--PAYLOAD END--'
		)
	},
	error(file,method,message,error) {
		console.error(
			`${this.level.ERROR}: ${file} - ${method}() - ${message}`,'\n',
			'--ERROR TRACESTACK START--','\n',
			error,'\n',
			'ERROR TRACESTACK END--'
		)
	}
}
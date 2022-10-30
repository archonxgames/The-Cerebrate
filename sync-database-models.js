const fs = require('node:fs')
const path = require('node:path')

console.log('INFO - Syncing Database Models')
const modelsPath = path.join(__dirname, 'data/models')
const modelFiles = fs.readdirSync(modelsPath).filter(file => file.endsWith('.js'))

for (const file of modelFiles) {
	console.log(`INFO - Syncing Model ${file}`)
	const filePath = path.join(modelsPath, file)
	const model = require(filePath)
	// Sync database model
	model.data.sync({ alter: true })
}
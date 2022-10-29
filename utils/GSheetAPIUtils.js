const fs = require('fs').promises
const path = require('path')
const process = require('process')
const {authenticate} = require('@google-cloud/local-auth')
const {google} = require('googleapis')

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json')
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json')

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH)
    const credentials = JSON.parse(content)
    return google.auth.fromJSON(credentials)
  } catch (err) {
    return null
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH)
  const keys = JSON.parse(content)
  const key = keys.installed || keys.web
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  })
  await fs.writeFile(TOKEN_PATH, payload)
}

/**
* Load or request or authorization to call APIs.
*
* @return {OAuth2Client} client
*/
async function authorize() {
	let client = await loadSavedCredentialsIfExist()
	if (client) {
		return client
	}
	client = await authenticate({
		scopes: SCOPES,
		keyfilePath: CREDENTIALS_PATH,
	})
	if (client.credentials) {
		await saveCredentials(client)
	}
	return client
}

module.exports = {
/**
* Gets cell values from a Spreadsheet.
* @param {string} spreadsheetId The spreadsheet ID.
* @param {string} range The sheet range.
* @return {obj} spreadsheet information
*/
async getValues(spreadsheetId, range) {
	const {google} = require('googleapis')
	const service = google.sheets({version: 'v4', auth: await authorize()})
	try {
		const result = await service.spreadsheets.values.get({
			spreadsheetId,
			range,
		})
		const numRows = result.data.values ? result.data.values.length : 0
		console.log(`INFO - ${numRows} rows retrieved.`)
		return result
	} catch (err) {
		// TODO (developer) - Handle exception
		throw err
	}
},

/**
 * Updates values in a Spreadsheet.
 * @param {string} spreadsheetId The spreadsheet ID.
 * @param {string} range The range of values to update.
 * @param {object} valueInputOption Value update options.
 * @param {(string[])[]} values A 2d array of values to update.
 * @return {obj} spreadsheet information
 */
 async updateValues(spreadsheetId, range, valueInputOption, values) {
  const {google} = require('googleapis')
  const service = google.sheets({version: 'v4', auth: await authorize()})
  const resource = { values }
  try {
    const result = await service.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption,
      resource,
    })
    console.log('INFO - %d cells updated.', result.data.updatedCells)
    return result
  } catch (err) {
    // TODO (Developer) - Handle exception
    throw err
  }
},

/**
 * Appends values in a Spreadsheet.
 * @param {string} spreadsheetId The spreadsheet ID.
 * @param {string} range The range of values to append.
 * @param {object} valueInputOption Value input options.
 * @param {(string[])[]} _values A 2d array of values to append.
 * @return {obj} spreadsheet information
 */
 async appendValues(spreadsheetId, range, valueInputOption, values) {
  const {google} = require('googleapis')
  const service = google.sheets({version: 'v4', auth: await authorize()})

	const resource = { values }
  try {
    const result = await service.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption,
      resource,
    })
    console.log(`INFO - ${result.data.updates.updatedCells} cells appended.`)
    return result
  } catch (err) {
    // TODO (developer) - Handle exception
    throw err
  }
}}
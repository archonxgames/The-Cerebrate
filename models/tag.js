const { mysqlDB, mysqlHost, mysqlPort, mysqlUser, mysqlPass } = require('../config.json');
const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize(`mysql://${mysqlUser}:${mysqlPass}@${mysqlHost}:${mysqlPort}/${mysqlDB}`)

const model = sequelize.define('Tag', {
	tag: {
		type: DataTypes.STRING,
		allowNull: false,
		primaryKey: true
	},
	count: {
		type: DataTypes.INTEGER,
		allowNull: false,
		defaultValue: 0
	}
})

module.exports = {
	data: model
}
const mongoose = require('mongoose')

const settingsSchema = new mongoose.Schema({
	id: {
		type: ObjectId,
		required: true
	},
	darkmode: {
		type: Integer,
		required: true
	},
	saveKeychain: {
		type: Integer,
		required: true
	},
	profileBio: {
		type: String,
		required: true
	},
	lastUpdated: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.module('Settings, settingsSchema')


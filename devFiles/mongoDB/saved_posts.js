const mongoose = require('mongoose')

const savedPosts = new mongoose.Schema({
	userId: {
		type: Integer,
		required: true
	},
	post: {
		type: String,
		required: true
	}
})

module.exports = mongoose.module('Saved, savedPosts')


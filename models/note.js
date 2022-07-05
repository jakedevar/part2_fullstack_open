const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to ', url)
// const url = `mongodb+srv://jakedevar:${password}@cluster0.xkhalmx.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(url)
.then(res => console.log('connected to MongoDB'))
.catch(err => console.log('error connecting to MongoDB: ', err))

const noteSchema = new mongoose.Schema({
	content: String,
	date: Date,
	important: Boolean,
})

noteSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})


module.exports = mongoose.model('Note', noteSchema)

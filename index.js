require('dotenv').config()
const Note = require('./models/note')
const cors = require('cors')
const express = require('express')
const app = express()

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

const errorHandler = (error, req, rew, next) => {
	console.log(error.message)

	if (error.name === 'CastError') {
		return res.status(400).send({error: "malformated id"})
	}

	next(error)
}


app.get('/', (req, res) => {
	res.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (req, res) => {
	Note.find({}).then(notes => res.json(notes))
})

app.use(errorHandler)
app.get('/api/notes/:id', (req, res, next) => {
	const id = Number(req.params.id)
	Note.findById(id).then(note => {
		if (note) {
			res.json(note)
		} else {
			res.status(404).end()
		}
	}).catch(err => {
		next(err)
	})
})

app.delete('/api/notes/:id', (req, res, next) => {
	const id = Number(req.params.id)
	Note.findByAndRemove(id)
	.then(res => {
		res.status(204).end()
	})
	.catch(error => next(error))
})


// const generateId = () => {
// 	// const maxId = notes.length > 0 
// 	// ? Math.max(...notes, map(n => n.id))
// 	// : 0
// 	//
// 	const maxId = 9
// 	return maxId + 1
// }

app.post('/api/notes', (req, res) => {
	const body = req.body

	if (!body.content) {
		return res.status(400).json({
			error: 'content missing'
		})
	}

	const note = new Note({
		content: body.content,
		important: body.important || false,
		date: new Date(),
	})

	note.save().then(savedNote => {
		res.json(savedNote)
	})
})

app.put('/api/notes/:id', (req, res, next) => {
	const body = req.body
	const id = Number(req.params.id)

	const note = {
		content: body.content,
		important: body.important
	}

	Note.findByIdAndUpdate(id, note, {new: true})
	.then(updatedNote => {
		res.json(updatedNote)
	})
	.catch(error => next(error))
})


const PORT = process.env.PORT 
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})


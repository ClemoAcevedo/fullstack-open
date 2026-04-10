require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (req) => {
    return req.method === 'POST'
        ? JSON.stringify(req.body)
        : ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info', async (request, response) => {
    const amount = await Person.countDocuments({})
    const date = new Date()

    response.send(`
    <p>Phonebook has info for ${amount} people</p>
    <p>${date}</p>
  `)
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(() => {
            response.status(400).json({ error: 'malformatted id' })
        })
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(() => {
            response.status(400).json({ error: 'malformatted id' })
        })
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

    Person.findOne({ name: body.name }).then(existing => {
        if (existing) {
            return response.status(400).json({
                error: 'name must be unique'
            })
        }

        const person = new Person({
            name: body.name,
            number: body.number
        })

        person.save().then(savedPerson => {
            response.status(201).json(savedPerson)
        })
    })
})

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
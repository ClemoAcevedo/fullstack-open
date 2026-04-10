require('dotenv').config()

// ==========================
// IMPORTS
// ==========================
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

// ==========================
// APP INIT
// ==========================
const app = express()

// ==========================
// BUILT-IN MIDDLEWARES
// ==========================
app.use(express.json())
app.use(express.static('dist'))

// ==========================
// CUSTOM MIDDLEWARES
// ==========================
morgan.token('body', (req) => {
  return req.method === 'POST'
    ? JSON.stringify(req.body)
    : ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// ==========================
// ROUTES
// ==========================

// GET all persons
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// GET info
app.get('/info', async (request, response) => {
  const amount = await Person.countDocuments({})
  const date = new Date()

  response.send(`
    <p>Phonebook has info for ${amount} people</p>
    <p>${date}</p>
  `)
})

// GET person by id
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// DELETE person
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// POST new person
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  Person.findOne({ name: body.name })
    .then(existing => {
      if (existing) {
        return response.status(400).json({
          error: 'name must be unique'
        })
      }

      const person = new Person({
        name: body.name,
        number: body.number
      })

      return person.save()
    })
    .then(savedPerson => {
      if (savedPerson) {
        response.status(201).json(savedPerson)
      }
    })
    .catch(error => next(error))
})

// Update phone number of a person
app.put('/api/persons/:id', (request, response, next) => {
  const { number } = request.body

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      person.number = number

      return person.save()
    })
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson)
      }
    })
    .catch(error => next(error))
})

// ==========================
// UNKNOWN ENDPOINT HANDLER
// ==========================

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// ==========================
// ERROR HANDLER
// ==========================
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

// ==========================
// SERVER START
// ==========================
const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
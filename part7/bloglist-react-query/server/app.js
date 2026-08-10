const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const app = express()

logger.info('connecting to', config.MONGODB_URI)

const connectToDatabase = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI, { family: 4 })
    logger.info('connected to MongoDB')
  } catch (error) {
    logger.error('error connection to MongoDB:', error.message)
  }
}

connectToDatabase()

app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use('/api', middleware.unknownEndpoint)

if (process.env.NODE_ENV === 'production') {
  const frontendDist = path.join(__dirname, '../client/dist')

  app.use(express.static(frontendDist))
  app.get('/*splat', (request, response) => {
    response.sendFile(path.join(frontendDist, 'index.html'))
  })
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app

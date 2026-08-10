const { test, beforeEach, describe, after } = require('node:test')
const assert = require('node:assert')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const mongoose = require('mongoose')

const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

describe('login', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)

    const user = new User({
      username: 'root',
      name: 'Superuser',
      passwordHash,
    })

    await user.save()
  })

  test('succeeds with valid credentials', async () => {
    const credentials = {
      username: 'root',
      password: 'sekret',
    }

    const result = await api
      .post('/api/login')
      .send(credentials)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert(result.body.token)
    assert.strictEqual(result.body.username, 'root')
    assert.strictEqual(result.body.name, 'Superuser')
  })

  test('fails with status code 401 if password is wrong', async () => {
    const credentials = {
      username: 'root',
      password: 'wrongpassword',
    }

    const result = await api
      .post('/api/login')
      .send(credentials)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(
      result.body.error,
      'invalid username or password'
    )
  })

  test('fails with status code 401 if username does not exist', async () => {
    const credentials = {
      username: 'notexistinguser',
      password: 'sekret',
    }

    const result = await api
      .post('/api/login')
      .send(credentials)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(
      result.body.error,
      'invalid username or password'
    )
  })
})

after(async () => {
  await mongoose.connection.close()
})
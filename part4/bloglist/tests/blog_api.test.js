const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json and the amount corresponds', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('blogs have id attribute instead of _id', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const exampleBlog = response.body[0]

  assert.ok(exampleBlog.id)
  assert.strictEqual(exampleBlog._id, undefined)
})

test('new blog', async () => {
  const newBlog = {
    title: 'Async/Await Under the Hood',
    author: 'Ada Lovelace',
    url: 'https://devinsights.dev/async-await-under-the-hood',
    likes: 3,
  }
  await api.post('/api/blogs').send(newBlog).expect(201).expect('Content-Type', /application\/json/)
  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const contents = blogsAtEnd.map(n => n.title)
  assert(contents.includes('Async/Await Under the Hood'))
})

test('likes default to 0', async () => {
  const newBlog = {
    title: 'Async/Await Under the Hood',
    author: 'Ada Lovelace',
    url: 'https://devinsights.dev/async-await-under-the-hood'
  }
  const savedBlog = await api.post('/api/blogs').send(newBlog).expect(201).expect('Content-Type', /application\/json/)
  assert.strictEqual(savedBlog.body.likes, 0)
})

test('blog without title is not added', async () => {
  const newBlog = {
    author: 'Ada Lovelace',
    url: 'https://devinsights.dev/async-await-under-the-hood'
  }

  await api.post('/api/blogs').send(newBlog).expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('blog withoyt url is not added', async () => {
  const newBlog = {
    title: 'Async/Await Under the Hood',
    author: 'Ada Lovelace',
  }
  await api.post('/api/blogs').send(newBlog).expect(400)
  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

})

after(async () => {
  await mongoose.connection.close()
})
const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')

const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

let token

describe('when there are initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)

    const user = await User.create({
      username: 'root',
      name: 'Superuser',
      passwordHash,
      blogs: []
    })

    const loginResponse = await api
      .post('/api/login')
      .send({
        username: 'root',
        password: 'sekret'
      })
      .expect(200)

    token = loginResponse.body.token

    const savedBlogs = await Blog.insertMany(
      helper.initialBlogs.map(blog => ({
        ...blog,
        user: user._id
      }))
    )

    user.blogs = savedBlogs.map(blog => blog._id)
    await user.save()
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

  describe('viewing a specific blog', () => {
    test('succeeds with a valid id', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToView = blogsAtStart[0]

      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(resultBlog.body.id, blogToView.id)
      assert.strictEqual(resultBlog.body.title, blogToView.title)
      assert.strictEqual(resultBlog.body.author, blogToView.author)
      assert.strictEqual(resultBlog.body.url, blogToView.url)
      assert.strictEqual(resultBlog.body.likes, blogToView.likes)
    })

    test('fails with status code 404 if blog does not exist', async () => {
      const validNonExistingId = await helper.nonExistingId()

      await api
        .get(`/api/blogs/${validNonExistingId}`)
        .expect(404)
    })

    test('fails with status code 400 if id is invalid', async () => {
      await api
        .get('/api/blogs/invalid-id')
        .expect(400)
    })
  })

  describe('addition of a new blog', () => {
    test('succeeds with valid data and valid token', async () => {
      const blogsAtStart = await helper.blogsInDb()

      const newBlog = {
        title: 'Async/Await Under the Hood',
        author: 'Ada Lovelace',
        url: 'https://devinsights.dev/async-await-under-the-hood',
        likes: 3
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)

      const titles = blogsAtEnd.map(blog => blog.title)
      assert(titles.includes(newBlog.title))

      const usersAtEnd = await helper.usersInDb()
      const rootUser = usersAtEnd.find(user => user.username === 'root')
      assert.strictEqual(rootUser.blogs.length, blogsAtStart.length + 1)
    })

    test('likes default to 0', async () => {
      const newBlog = {
        title: 'Async/Await Under the Hood',
        author: 'Ada Lovelace',
        url: 'https://devinsights.dev/async-await-under-the-hood'
      }

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.likes, 0)
    })

    test('blog without title is not added', async () => {
      const blogsAtStart = await helper.blogsInDb()

      const newBlog = {
        author: 'Ada Lovelace',
        url: 'https://devinsights.dev/async-await-under-the-hood'
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
    })

    test('blog without url is not added', async () => {
      const blogsAtStart = await helper.blogsInDb()

      const newBlog = {
        title: 'Async/Await Under the Hood',
        author: 'Ada Lovelace'
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
    })

    test('blog without token is not added', async () => {
      const blogsAtStart = await helper.blogsInDb()

      const newBlog = {
        title: 'Async/Await Under the Hood',
        author: 'Ada Lovelace',
        url: 'https://devinsights.dev/async-await-under-the-hood',
        likes: 3
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

      const ids = blogsAtEnd.map(blog => blog.id)
      assert(!ids.includes(blogToDelete.id))
    })

    test('fails with status code 401 if token is not provided', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
    })

    test('fails with status code 403 if user is not the blog creator', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      const passwordHash = await bcrypt.hash('sekret', 10)
      await User.create({
        username: 'otheruser',
        name: 'Other User',
        passwordHash,
        blogs: []
      })

      const loginResponse = await api
        .post('/api/login')
        .send({
          username: 'otheruser',
          password: 'sekret'
        })
        .expect(200)

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .expect(403)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
    })
  })

  describe('updating a blog', () => {
    test('succeeds with valid data', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const updatedBlog = {
        title: blogToUpdate.title,
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: blogToUpdate.likes + 1
      }

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.likes, updatedBlog.likes)
      assert.strictEqual(response.body.title, blogToUpdate.title)
    })

    test('fails with status code 404 if blog does not exist', async () => {
      const validNonExistingId = await helper.nonExistingId()

      const updatedBlog = {
        title: 'Updated title',
        author: 'Ada Lovelace',
        url: 'https://devinsights.dev/updated-title',
        likes: 10
      }

      await api
        .put(`/api/blogs/${validNonExistingId}`)
        .send(updatedBlog)
        .expect(404)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})

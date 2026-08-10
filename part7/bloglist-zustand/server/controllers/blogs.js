const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog
      .find({})
      .populate('user', {
        username: 1,
        name: 1
      })

    response.json(blogs)
  } catch (error) {
    next(error)
  }
})

blogsRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)

    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

blogsRouter.post('/', userExtractor, async (request, response, next) => {
  const body = request.body
  const user = request.user

  try {
    const blog = new Blog({
      ...body,
      user: user._id
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', userExtractor, async (request, response, next) => {
  try {
    const user = request.user
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
      return response.status(404).end()
    }

    if (!blog.user || blog.user.toString() !== user.id.toString()) {
      return response.status(403).json({
        error: 'only the blog creator can delete this blog'
      })
    }

    await Blog.findByIdAndDelete(request.params.id)
    user.blogs = user.blogs.filter(blogId => blogId.toString() !== blog.id)
    await user.save()

    response.status(204).end()
  }
  catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const { title, author, url, likes } = request.body

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      { title, author, url, likes },
      { returnDocument: 'after', runValidators: true, context: 'query' }
    )
    if (updatedBlog) {
      response.json(updatedBlog)
    }
    else {
      response.status(404).end()
    }

  }
  catch (error) {
    next(error)
  }
})

module.exports = blogsRouter

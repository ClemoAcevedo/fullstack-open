const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  let sum = 0
  blogs.forEach(blog => {
    sum += blog.likes
  })
  return sum
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  let favorite_blog = blogs[0]

  blogs.forEach(blog => {
    if (blog.likes > favorite_blog.likes) {
      favorite_blog = blog
    }
  })

  return favorite_blog
}

const mostBlogs = (blogs) => {

  let authors = {}
  if (blogs.length === 0) return null
  blogs.forEach(blog => {
    if (authors[blog.author]) {
      authors[blog.author] += 1
    }
    else if (!authors[blog.author]) {
      authors[blog.author] = 1
    }

  })
  let maxAuthor = null
  let maxBlogs = 0

  for (const author in authors) {
    if (authors[author] > maxBlogs) {
      maxBlogs = authors[author]
      maxAuthor = author
    }
  }
  return { 'author': maxAuthor, 'blogs': authors[maxAuthor] }
}

const mostLikes = (blogs) => {

  let authors = {}
  if (blogs.length === 0) return null
  blogs.forEach(blog => {
    if (authors[blog.author]) {
      authors[blog.author] += blog.likes
    }
    else if (!authors[blog.author]) {
      authors[blog.author] = blog.likes
    }

  })
  let maxAuthor = null
  let maxLikes = 0

  for (const author in authors) {
    if (authors[author] > maxLikes) {
      maxLikes = authors[author]
      maxAuthor = author
    }
  }
  return { 'author': maxAuthor, 'likes': authors[maxAuthor] }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
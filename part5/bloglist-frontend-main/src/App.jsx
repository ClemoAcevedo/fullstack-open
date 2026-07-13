import { useEffect, useState } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  // notifications
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState(null)


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedNoteappUser',
        JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)

      setNotificationMessage('successful login')
      setNotificationType('success')

      setTimeout(() => {
        setNotificationMessage(null)
        setNotificationType(null)
      }, 5000)
    } catch {
      setNotificationMessage('wrong username or password')
      setNotificationType('error')

      setTimeout(() => {
        setNotificationMessage(null)
        setNotificationType(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    blogService.setToken('')
    setUser(null)

    setNotificationMessage('successful logout')
    setNotificationType('success')

    setTimeout(() => {
      setNotificationMessage(null)
      setNotificationType(null)
    }, 5000)
  }

  const handleCreation = async (blogObject) => {
    try {
      const blog = await blogService.create(blogObject)

      setNotificationMessage(
        `a new blog ${blog.title} by ${blog.author}`
      )
      setNotificationType('success')

      setTimeout(() => {
        setNotificationMessage(null)
        setNotificationType(null)
      }, 5000)

      setBlogs(prevBlogs => prevBlogs.concat(blog))
    } catch {
      setNotificationMessage('error in the creation of the blog')
      setNotificationType('error')

      setTimeout(() => {
        setNotificationMessage(null)
        setNotificationType(null)
      }, 5000)
    }
  }

  const showBlogs = () => (
    <div>
      <h2>blogs</h2>

      <button onClick={sortBlogsByLikes}>
        sort by likes
      </button>

      <Togglable buttonLabel="new blog">
        <BlogForm createBlog={handleCreation} />
      </Togglable>

      <p>{user.name} logged in</p>
      <button onClick={handleLogout}>logout</button>

      {blogs.map(blog => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          handleLike={handleLike}
          handleRemove={handleRemove}
        />
      ))}
    </div>
  )

  const handleLike = async (blogObject) => {
    const updatedBlog = {
      ...blogObject,
      likes: blogObject.likes + 1,
    }

    try {
      const returnedBlog = await blogService.update(blogObject.id, updatedBlog)

      setBlogs(blogs.map(blog =>
        blog.id === returnedBlog.id ? returnedBlog : blog
      ))
    } catch (error) {
      console.log(error)
    }
  }

  const sortBlogsByLikes = () => {
    const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)
    setBlogs(sortedBlogs)
  }

  const handleRemove = async (blog) => {
    const ok = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}`
    )

    if (!ok) return

    try {
      await blogService.remove(blog.id)

      setBlogs(prevBlogs =>
        prevBlogs.filter(b => b.id !== blog.id)
      )
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <Notification
        message={notificationMessage}
        type={notificationType}
      />

      {!user ? (
        <LoginForm handleLogin={handleLogin} />
      ) : (
        showBlogs()
      )}
    </div>
  )
}

export default App
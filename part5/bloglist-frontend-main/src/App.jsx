import { useEffect, useState } from 'react'
import {
  Link,
  Route,
  Routes,
  useMatch,
  useNavigate
} from 'react-router-dom'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  // notifications
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState(null)

  const navigate = useNavigate()

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

  const match = useMatch('/blogs/:id')

  const blog = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null

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

      navigate('/')
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

    navigate('/')
  }

  const handleCreation = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)

      const blogWithUser = {
        ...returnedBlog,
        user
      }

      setBlogs(prevBlogs =>
        prevBlogs.concat(blogWithUser)
      )

      setNotificationMessage(
        `a new blog ${returnedBlog.title} by ${returnedBlog.author}`
      )
      setNotificationType('success')

      setTimeout(() => {
        setNotificationMessage(null)
        setNotificationType(null)
      }, 5000)

      navigate('/')
    } catch {
      setNotificationMessage('error in the creation of the blog')
      setNotificationType('error')

      setTimeout(() => {
        setNotificationMessage(null)
        setNotificationType(null)
      }, 5000)
    }
  }

  const handleLike = async (blogObject) => {
    const updatedBlog = {
      ...blogObject,
      likes: blogObject.likes + 1,
    }

    try {
      const returnedBlog = await blogService.update(
        blogObject.id,
        updatedBlog
      )

      const blogWithUser = {
        ...returnedBlog,
        user: blogObject.user
      }

      setBlogs(blogs.map(blog =>
        blog.id === blogWithUser.id ? blogWithUser : blog
      ))
    } catch (error) {
      console.log(error)
    }
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

      navigate('/')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <div>
        <Link to="/">blogs</Link>{' '}

        {!user && (
          <Link to="/login">login</Link>
        )}

        {user && (
          <>
            <Link to="/create">create</Link>{' '}
            {user.name} logged in{' '}
            <button onClick={handleLogout}>
              logout
            </button>
          </>
        )}
      </div>

      <Notification
        message={notificationMessage}
        type={notificationType}
      />

      <Routes>
        <Route
          path="/"
          element={
            <BlogList blogs={blogs} />
          }
        />

        <Route
          path="/blogs/:id"
          element={
            <Blog
              blog={blog}
              user={user}
              handleLike={handleLike}
              handleRemove={handleRemove}
            />
          }
        />

        <Route
          path="/login"
          element={
            <LoginForm handleLogin={handleLogin} />
          }
        />

        <Route
          path="/create"
          element={
            user
              ? <BlogForm createBlog={handleCreation} />
              : <LoginForm handleLogin={handleLogin} />
          }
        />
      </Routes>
    </div>
  )
}

export default App
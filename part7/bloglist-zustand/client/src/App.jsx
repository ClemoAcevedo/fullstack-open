import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import {
  Link,
  Route,
  Routes,
  useMatch,
  useNavigate
} from 'react-router-dom'
import Blog from './components/Blog'
import ErrorBoundary from './components/ErrorBoundary'
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
    <>
      <AppBar position="static">
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{
              minHeight: { xs: 64, sm: 72 },
              gap: 1,
              flexWrap: { xs: 'wrap', sm: 'nowrap' },
              py: { xs: 1, sm: 0 },
            }}
          >
            <Typography
              component={Link}
              to="/"
              variant="h6"
              sx={{
                color: 'inherit',
                textDecoration: 'none',
                fontWeight: 800,
                mr: { sm: 2 },
              }}
            >
              Bloglist
            </Typography>

            <Box component="nav" sx={{ display: 'flex', gap: 0.5 }}>
              <Button component={Link} to="/" color="inherit">
                blogs
              </Button>

              {!user && (
                <Button component={Link} to="/login" color="inherit">
                  login
                </Button>
              )}

              {user && (
                <Button component={Link} to="/create" color="inherit">
                  create
                </Button>
              )}
            </Box>

            {user && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  ml: { sm: 'auto' },
                  width: { xs: '100%', sm: 'auto' },
                  justifyContent: { xs: 'space-between', sm: 'flex-end' },
                }}
              >
                <Typography variant="body2">
                  {user.name} logged in
                </Typography>
                <Button
                  color="inherit"
                  variant="outlined"
                  size="small"
                  onClick={handleLogout}
                  sx={{ borderColor: 'rgba(255, 255, 255, 0.6)' }}
                >
                  logout
                </Button>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Container
        component="main"
        maxWidth="lg"
        sx={{ py: { xs: 3, sm: 5 } }}
      >
        <ErrorBoundary>
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

            <Route
              path="*"
              element={<Typography variant="h3">Page not found</Typography>}
            />
          </Routes>
        </ErrorBoundary>
      </Container>
    </>
  )
}

export default App

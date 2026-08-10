import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from '@mui/material'
import { useEffect } from 'react'
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
import User from './components/User'
import Users from './components/Users'
import blogService from './services/blogs'
import { getUser, removeUser, saveUser } from './services/persistentUser'
import useBlogStore from './stores/blogStore'
import loginService from './services/login'
import useNotificationStore from './stores/notificationStore'
import useUserStore from './stores/userStore'

const App = () => {
  const blogs = useBlogStore((state) => state.blogs)
  const setBlogs = useBlogStore((state) => state.setBlogs)
  const addBlog = useBlogStore((state) => state.addBlog)
  const updateBlog = useBlogStore((state) => state.updateBlog)
  const removeBlog = useBlogStore((state) => state.removeBlog)
  const { setNotification, clearNotification } = useNotificationStore()
  const user = useUserStore((state) => state.user)
  const setUser = useUserStore((state) => state.setUser)

  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [setBlogs])

  useEffect(() => {
    const user = getUser()

    if (user) {
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [setUser])

  const match = useMatch('/blogs/:id')

  const blog = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password })

      saveUser(user)

      blogService.setToken(user.token)
      setUser(user)

      setNotification('successful login', 'success')

      setTimeout(() => {
        clearNotification()
      }, 5000)

      navigate('/')
    } catch {
      setNotification('wrong username or password', 'error')

      setTimeout(() => {
        clearNotification()
      }, 5000)
    }
  }

  const handleLogout = () => {
    removeUser()
    blogService.setToken('')
    setUser(null)

    setNotification('successful logout', 'success')

    setTimeout(() => {
      clearNotification()
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

      addBlog(blogWithUser)

      setNotification(
        `a new blog ${returnedBlog.title} by ${returnedBlog.author}`,
        'success'
      )

      setTimeout(() => {
        clearNotification()
      }, 5000)

      navigate('/')
    } catch {
      setNotification('error in the creation of the blog', 'error')

      setTimeout(() => {
        clearNotification()
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

      updateBlog(blogWithUser)
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

      removeBlog(blog.id)

      setNotification(
        `blog ${blog.title} by ${blog.author} was removed`,
        'success'
      )

      setTimeout(() => {
        clearNotification()
      }, 5000)

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

              <Button component={Link} to="/users" color="inherit">
                users
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
          <Notification />

          <Routes>
            <Route
              path="/"
              element={
                <BlogList />
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

            <Route path="/users" element={<Users />} />

            <Route path="/users/:id" element={<User />} />

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

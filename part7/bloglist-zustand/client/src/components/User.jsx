import {
  Box,
  List,
  ListItem,
  Paper,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import userService from '../services/users'

const User = () => {
  const [user, setUser] = useState(null)
  const { id } = useParams()

  useEffect(() => {
    userService.getAll().then(users => {
      setUser(users.find(user => user.id === id))
    })
  }, [id])

  if (!user) return null

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper
        variant="outlined"
        sx={{ p: { xs: 3, sm: 4 }, mb: 3, bgcolor: 'primary.main', color: 'primary.contrastText' }}
      >
        <Typography component="h1" variant="h3">
          {user.name}
        </Typography>
      </Paper>

      <Typography component="h2" variant="h5" sx={{ mb: 1.5 }}>
        Added blogs
      </Typography>

      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <List>
          {user.blogs.map(blog => (
            <ListItem
              key={blog.id}
              sx={{ py: 1.5, '&:not(:last-child)': { borderBottom: 1, borderColor: 'divider' } }}
            >
              {blog.title}
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  )
}

export default User

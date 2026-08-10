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
    <Box>
      <Typography component="h1" variant="h3" sx={{ mb: 3 }}>
        {user.name}
      </Typography>

      <Typography component="h2" variant="h5" sx={{ mb: 1 }}>
        Added blogs
      </Typography>

      <Paper variant="outlined">
        <List>
          {user.blogs.map(blog => (
            <ListItem key={blog.id}>{blog.title}</ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  )
}

export default User

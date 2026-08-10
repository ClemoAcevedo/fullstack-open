import {
  Box,
  List,
  ListItem,
  Paper,
  Typography,
} from '@mui/material'
import { useParams } from 'react-router-dom'
import useUsers from '../hooks/useUsers'

const User = () => {
  const { id } = useParams()
  const { data: users = [] } = useUsers()
  const user = users.find(user => user.id === id)

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

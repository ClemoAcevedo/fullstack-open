import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    await createBlog({
      title,
      author,
      url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        maxWidth: 640,
        mx: 'auto',
        p: { xs: 3, sm: 4 },
      }}
    >
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Box>
            <Typography component="h1" variant="h4" gutterBottom>
              Create new blog
            </Typography>
            <Typography color="text.secondary">
              Add an article to your reading list.
            </Typography>
          </Box>

          <TextField
            label="Title"
            name="title"
            type="text"
            required
            fullWidth
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />

          <TextField
            label="Author"
            name="author"
            type="text"
            required
            fullWidth
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />

          <TextField
            label="URL"
            name="url"
            type="url"
            placeholder="https://example.com/article"
            required
            fullWidth
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{ alignSelf: { sm: 'flex-start' }, minWidth: 140 }}
          >
            create
          </Button>
        </Stack>
      </Box>
    </Paper>
  )
}

export default BlogForm

import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import useField from '../hooks/useField'

const BlogForm = ({ createBlog }) => {
  const { reset: resetTitle, ...title } = useField('text')
  const { reset: resetAuthor, ...author } = useField('text')
  const { reset: resetUrl, ...url } = useField('url')

  const handleSubmit = async (event) => {
    event.preventDefault()

    await createBlog({
      title: title.value,
      author: author.value,
      url: url.value
    })

    resetTitle()
    resetAuthor()
    resetUrl()
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
            required
            fullWidth
            {...title}
          />

          <TextField
            label="Author"
            name="author"
            required
            fullWidth
            {...author}
          />

          <TextField
            label="URL"
            name="url"
            placeholder="https://example.com/article"
            required
            fullWidth
            {...url}
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

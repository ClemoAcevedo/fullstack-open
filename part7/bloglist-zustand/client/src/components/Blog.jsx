import {
  Box,
  Button,
  Chip,
  Divider,
  Link,
  List,
  ListItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import useField from '../hooks/useField'

const Blog = ({ blog, user, handleLike, handleComment, handleRemove }) => {
  const { reset: resetComment, ...comment } = useField('text')

  if (!blog) {
    return null
  }

  const submitComment = async (event) => {
    event.preventDefault()

    await handleComment(blog, comment.value)
    resetComment()
  }

  return (
    <Paper
      component="article"
      variant="outlined"
      sx={{
        maxWidth: 800,
        mx: 'auto',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ p: { xs: 3, sm: 5 } }}>
        <Stack spacing={3}>
          <Box>
            <Typography
              component="h1"
              variant="h3"
              sx={{
                fontSize: { xs: '2rem', sm: '2.75rem' },
                overflowWrap: 'anywhere',
                mb: 1,
              }}
            >
              {blog.title}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {blog.author}
            </Typography>
          </Box>

          <Link
            href={blog.url}
            target="_blank"
            rel="noreferrer"
            sx={{ overflowWrap: 'anywhere', width: 'fit-content' }}
          >
            {blog.url}
          </Link>

          <Divider />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <Stack
              direction="row"
              spacing={1.5}
              sx={{ alignItems: 'center' }}
            >
              <Chip
                label={`${blog.likes} likes`}
                color="secondary"
                variant="outlined"
              />
              {user && (
                <Button
                  variant="contained"
                  onClick={() => handleLike(blog)}
                >
                  like
                </Button>
              )}
            </Stack>

            <Typography color="text.secondary">
              added by {blog.user.name}
            </Typography>
          </Box>

          <Divider />

          <Box component="section">
            <Typography component="h2" variant="h5" sx={{ mb: 2 }}>
              Comments
            </Typography>

            <Box
              component="form"
              onSubmit={submitComment}
              sx={{ display: 'flex', gap: 1, mb: 2 }}
            >
              <TextField
                label="Comment"
                required
                size="small"
                fullWidth
                {...comment}
              />
              <Button type="submit" variant="contained">
                add comment
              </Button>
            </Box>

            <List disablePadding>
              {blog.comments?.map((comment, index) => (
                <ListItem key={`${comment}-${index}`} disableGutters>
                  {comment}
                </ListItem>
              ))}
            </List>
          </Box>
        </Stack>
      </Box>

      {user && blog.user.username === user.username && (
        <Box
          sx={{
            px: { xs: 3, sm: 5 },
            py: 2,
            bgcolor: 'grey.50',
            borderTop: 1,
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button
            color="error"
            variant="outlined"
            onClick={() => handleRemove(blog)}
          >
            remove
          </Button>
        </Box>
      )}
    </Paper>
  )
}

export default Blog

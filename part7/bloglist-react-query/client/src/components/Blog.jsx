import {
  Box,
  Button,
  Chip,
  Divider,
  Link,
  Paper,
  Stack,
  Typography,
} from '@mui/material'

const Blog = ({ blog, user, handleLike, handleRemove }) => {
  if (!blog) {
    return null
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
            <Stack direction="row" spacing={1.5} alignItems="center">
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

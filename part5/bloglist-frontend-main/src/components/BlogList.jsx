import {
  Box,
  Link as MuiLink,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { Link } from 'react-router-dom'

const BlogList = ({ blogs }) => {
  return (
    <Box>
      <Typography component="h1" variant="h3" sx={{ mb: 3 }}>
        Blogs
      </Typography>

      <Stack spacing={1.5}>
        {[...blogs]
          .sort((a, b) => b.likes - a.likes)
          .map(blog => (
            <Paper
              key={blog.id}
              variant="outlined"
              sx={{
                p: 2,
                transition: 'border-color 150ms, box-shadow 150ms',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: 1,
                },
              }}
            >
              <MuiLink
                component={Link}
                to={`/blogs/${blog.id}`}
                variant="h6"
                underline="hover"
              >
                {blog.title}
              </MuiLink>
              <Typography color="text.secondary">
                {blog.author}
              </Typography>
            </Paper>
          ))}
      </Stack>
    </Box>
  )
}

export default BlogList

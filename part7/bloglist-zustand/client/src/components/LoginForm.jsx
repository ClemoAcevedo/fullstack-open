import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import useField from '../hooks/useField'

const LoginForm = ({ handleLogin }) => {
  const username = useField('text')
  const { reset: resetPassword, ...password } = useField('password')

  const submit = (event) => {
    event.preventDefault()

    handleLogin({
      username: username.value,
      password: password.value,
    })

    resetPassword()
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        maxWidth: 480,
        mx: 'auto',
        p: { xs: 3, sm: 4 },
      }}
    >
      <Box component="form" onSubmit={submit}>
        <Stack spacing={3}>
          <Box>
            <Typography component="h1" variant="h4" gutterBottom>
              Login
            </Typography>
            <Typography color="text.secondary">
              Sign in to create and manage blogs.
            </Typography>
          </Box>

          <TextField
            label="username"
            name="username"
            autoComplete="username"
            required
            fullWidth
            {...username}
          />

          <TextField
            label="password"
            name="password"
            autoComplete="current-password"
            required
            fullWidth
            {...password}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
          >
            login
          </Button>
        </Stack>
      </Box>
    </Paper>
  )
}

export default LoginForm

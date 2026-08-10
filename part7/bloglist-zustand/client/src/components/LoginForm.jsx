import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const submit = (event) => {
    event.preventDefault()

    handleLogin({
      username,
      password,
    })

    setPassword('')
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
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />

          <TextField
            label="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            fullWidth
            value={password}
            onChange={({ target }) => setPassword(target.value)}
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

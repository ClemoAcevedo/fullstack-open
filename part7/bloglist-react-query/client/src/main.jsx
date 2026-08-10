import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App'
import { NotificationContextProvider } from './NotificationContext'
import './index.css'

const theme = createTheme({
  palette: {
    primary: {
      main: '#176b5b',
      dark: '#0e4f43',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#d97706',
    },
    background: {
      default: '#f5f7f6',
      paper: '#ffffff',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", Arial, sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Router>
      <NotificationContextProvider>
        <App />
      </NotificationContextProvider>
    </Router>
  </ThemeProvider>
)

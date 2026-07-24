import { Alert, Collapse } from '@mui/material'

const Notification = ({ message, type }) => {
  return (
    <Collapse in={message !== null}>
      {message !== null && (
        <Alert
          severity={type === 'error' ? 'error' : 'success'}
          variant="filled"
          sx={{ mb: 3 }}
        >
          {message}
        </Alert>
      )}
    </Collapse>
  )
}

export default Notification

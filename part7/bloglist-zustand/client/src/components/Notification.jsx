import { Alert, Collapse } from '@mui/material'
import useNotificationStore from '../stores/notificationStore'

const Notification = () => {
  const { message, type } = useNotificationStore()

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

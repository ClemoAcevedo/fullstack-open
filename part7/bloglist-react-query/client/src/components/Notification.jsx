import { Alert, Collapse } from '@mui/material'
import { useNotificationValue } from '../NotificationContext'

const Notification = () => {
  const notification = useNotificationValue()

  return (
    <Collapse in={notification !== null}>
      {notification !== null && (
        <Alert
          severity={notification.type === 'error' ? 'error' : 'success'}
          variant="filled"
          sx={{ mb: 3 }}
        >
          {notification.message}
        </Alert>
      )}
    </Collapse>
  )
}

export default Notification

import { createContext, useContext, useReducer } from 'react'

const NotificationContext = createContext()

const notificationReducer = (state, action) => {
  switch (action.type) {
  case 'SET_NOTIFICATION':
    return action.payload
  case 'CLEAR_NOTIFICATION':
    return null
  default:
    return state
  }
}

export const NotificationContextProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, null)

  return (
    <NotificationContext.Provider value={[notification, dispatch]}>
      {children}
    </NotificationContext.Provider>
  )
}

// Context hooks intentionally share this module with its provider.
// eslint-disable-next-line react-refresh/only-export-components
export const useNotificationValue = () => {
  const [notification] = useContext(NotificationContext)
  return notification
}

// eslint-disable-next-line react-refresh/only-export-components
export const useNotificationDispatch = () => {
  const [, dispatch] = useContext(NotificationContext)
  return dispatch
}

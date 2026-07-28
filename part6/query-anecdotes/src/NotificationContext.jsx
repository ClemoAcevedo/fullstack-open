/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react'

const NotificationContext = createContext(null)

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SHOW':
      return action.payload
    case 'CLEAR':
      return ''
    default:
      return state
  }
}

export const NotificationContextProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, '')
  const timeoutId = useRef(null)

  const notify = useCallback((message) => {
    dispatch({ type: 'SHOW', payload: message })

    if (timeoutId.current) {
      clearTimeout(timeoutId.current)
    }

    timeoutId.current = setTimeout(() => {
      dispatch({ type: 'CLEAR' })
      timeoutId.current = null
    }, 5000)
  }, [])

  useEffect(
    () => () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current)
      }
    },
    []
  )

  const value = useMemo(
    () => ({ notification, notify }),
    [notification, notify]
  )

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

const useNotificationContext = () => {
  const context = useContext(NotificationContext)

  if (!context) {
    throw new Error(
      'Notification hooks must be used within a NotificationContextProvider'
    )
  }

  return context
}

export const useNotificationValue = () =>
  useNotificationContext().notification

export const useNotify = () => useNotificationContext().notify

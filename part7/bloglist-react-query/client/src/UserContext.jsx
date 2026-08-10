import { createContext, useContext, useReducer } from 'react'

const UserContext = createContext()

const userReducer = (state, action) => {
  switch (action.type) {
  case 'SET_USER':
    return action.payload
  case 'CLEAR_USER':
    return null
  default:
    return state
  }
}

export const UserContextProvider = ({ children }) => {
  const [user, dispatch] = useReducer(userReducer, null)

  return (
    <UserContext.Provider value={[user, dispatch]}>
      {children}
    </UserContext.Provider>
  )
}

// Context hooks intentionally share this module with its provider.
// eslint-disable-next-line react-refresh/only-export-components
export const useUserValue = () => {
  const [user] = useContext(UserContext)
  return user
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUserDispatch = () => {
  const [, dispatch] = useContext(UserContext)
  return dispatch
}

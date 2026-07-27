import { useEffect } from 'react'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Filter from './components/Filter'
import Notification from './components/Notification'
import { useAnecdoteActions } from './stores/anecdoteStore'

const App = () => {
  const { initialize } = useAnecdoteActions()

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <>
      <Notification />
      <AnecdoteForm />
      <Filter />
      <AnecdoteList />
    </>
  )
}

export default App
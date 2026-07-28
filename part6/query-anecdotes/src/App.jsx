import { useState } from 'react'

import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useAnecdotes } from './hooks/useAnecdotes'

const App = () => {
  const [notification, setNotification] = useState('')

  const {
    anecdotes,
    isPending,
    isError,
    voteAnecdote,
  } = useAnecdotes(setNotification)

  if (isPending) {
    return <div>loading data...</div>
  }

  if (isError) {
    return (
      <div>
        anecdote service not available due to problems in server
      </div>
    )
  }

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification message={notification} />

      <AnecdoteForm setNotification={setNotification} />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>

          <div>
            has {anecdote.votes}{' '}
            <button onClick={() => voteAnecdote(anecdote)}>
              vote
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
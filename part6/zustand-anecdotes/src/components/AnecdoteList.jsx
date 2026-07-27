import { useAnecdoteActions, useAnecdotes } from '../stores/anecdoteStore'
import { useNotificationActions } from '../stores/notificationStore'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()

  const {
    vote,
    remove,
  } = useAnecdoteActions()

  const { show } = useNotificationActions()

  const handleVote = async (id) => {
    const anecdote = await vote(id)

    show(`you voted '${anecdote.content}'`)
  }

  const handleDelete = async (id) => {
    const anecdote = anecdotes.find(
      (anecdote) => anecdote.id === id
    )

    await remove(id)

    show(`you deleted '${anecdote.content}'`)
  }

  return (
    <>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>

          <div>
            has {anecdote.votes}

            <button
              type="button"
              onClick={() => handleVote(anecdote.id)}
            >
              vote
            </button>

            {anecdote.votes === 0 && (
              <button
                type="button"
                onClick={() => handleDelete(anecdote.id)}
              >
                delete
              </button>
            )}
          </div>
        </div>
      ))}
    </>
  )
}

export default AnecdoteList
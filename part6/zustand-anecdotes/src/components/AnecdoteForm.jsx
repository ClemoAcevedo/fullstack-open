import { useAnecdoteActions } from '../stores/anecdoteStore'
import { useNotificationActions } from '../stores/notificationStore'

const AnecdoteForm = () => {
  const { create } = useAnecdoteActions()
  const { show } = useNotificationActions()

  const handleSubmit = async (event) => {
    event.preventDefault()

    const form = event.currentTarget

    const content = form.elements.content.value.trim()

    if (!content) {
      return
    }

    const anecdote = await create(content)

    show(`you created '${anecdote.content}'`)

    form.reset()
  }

  return (
    <>
      <h2>Create new</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            name="content"
            placeholder="Write an anecdote"
          />
        </div>

        <button type="submit">
          create
        </button>
      </form>
    </>
  )
}

export default AnecdoteForm
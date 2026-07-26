import { useAnecdoteActions } from '../stores/anecdoteStore'

const AnecdoteForm = () => {
  const { create } = useAnecdoteActions()

  const handleSubmit = (event) => {
    event.preventDefault()

    const content = event.currentTarget.elements.content.value.trim()

    if (!content) {
      return
    }

    create(content)
    event.currentTarget.reset()
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
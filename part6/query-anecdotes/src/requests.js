const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = async () => {
  try {
    const response = await fetch(baseUrl)

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Failed to retrieve anecdotes:', error)
    throw new Error(
      'anecdote service not available due to problems in server'
    )
  }
}

export const createAnecdote = async (newAnecdote) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newAnecdote),
  }

  try {
    const response = await fetch(baseUrl, options)

    if (!response.ok) {
      const data = await response.json().catch(() => null)

      throw new Error(
        data?.error || `Server responded with status ${response.status}`
      )
    }

    return await response.json()
  } catch (error) {
    console.error('Failed to create anecdote:', error)
    throw error
  }
}

export const updateAnecdote = async (updatedAnecdote) => {
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedAnecdote),
  }

  try {
    const response = await fetch(
      `${baseUrl}/${updatedAnecdote.id}`,
      options
    )

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Failed to update anecdote:', error)
    throw error
  }
}
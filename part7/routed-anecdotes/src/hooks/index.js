import { useEffect, useState } from 'react'
import anecdoteService from '../services/anecdotes'


export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  return {
    type,
    value,
    onChange,
    reset
  }
}

// modules can have several named exports

export const useAnotherHook = () => {
  // ...
}

export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([])

  useEffect(() => {
    anecdoteService.getAll().then(data => setAnecdotes(data))
  }, [])

  const addAnecdote = async (anecdote) => {
    const newAnecdote = await anecdoteService.createNew(anecdote)
    setAnecdotes(currentAnecdotes => currentAnecdotes.concat(newAnecdote))
  }

  const deleteAnecdote = async (id) => {
    await anecdoteService.deleteAnecdote(id)
    setAnecdotes(currentAnecdotes => currentAnecdotes.filter(anecdote => anecdote.id !== id))
  }

  return { anecdotes, addAnecdote, deleteAnecdote }
}

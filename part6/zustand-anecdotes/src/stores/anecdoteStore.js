import { create } from 'zustand'
import anecdoteService from '../services/anecdotes'

const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: '',

  actions: {
    vote: async (id) => {
      const anecdote = get().anecdotes.find(
        (anecdote) => anecdote.id === id
      )

      const updated = await anecdoteService.update(
        id,
        {
          ...anecdote,
          votes: anecdote.votes + 1,
        }
      )

      set((state) => ({
        anecdotes: state.anecdotes.map((anecdote) =>
          anecdote.id === id
            ? updated
            : anecdote
        ),
      }))

      return updated
    },

    create: async (content) => {
      const newAnecdote = await anecdoteService.createNew(content)

      set((state) => ({
        anecdotes: state.anecdotes.concat(newAnecdote),
      }))

      return newAnecdote
    },

    remove: async (id) => {
      await anecdoteService.remove(id)

      set((state) => ({
        anecdotes: state.anecdotes.filter(
          (anecdote) => anecdote.id !== id
        ),
      }))
    },

    setFilter: (value) =>
      set({
        filter: value,
      }),

    initialize: async () => {
      const anecdotes = await anecdoteService.getAll()

      set({
        anecdotes,
      })
    },
  },
}))

export const useAnecdotes = () =>
  useAnecdoteStore((state) => state.anecdotes)

export const useFilter = () =>
  useAnecdoteStore((state) => state.filter)

export const useAnecdoteActions = () =>
  useAnecdoteStore((state) => state.actions)

export default useAnecdoteStore
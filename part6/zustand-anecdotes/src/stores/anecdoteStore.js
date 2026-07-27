import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import anecdoteService from '../services/anecdotes'

const useAnecdoteStore = create(
  devtools((set, get) => ({
    anecdotes: [],
    filter: '',

    actions: {
      vote: async (id) => {
        const anecdote = get().anecdotes.find(
          (anecdote) => anecdote.id === id
        )

        const updated = await anecdoteService.update(id, {
          ...anecdote,
          votes: anecdote.votes + 1,
        })

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
        const newAnecdote =
          await anecdoteService.createNew(content)

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
)

export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore(
    (state) => state.anecdotes
  )

  const filter = useAnecdoteStore(
    (state) => state.filter
  )

  return anecdotes
    .filter((anecdote) =>
      anecdote.content
        .toLowerCase()
        .includes(filter.toLowerCase())
    )
    .toSorted((a, b) => b.votes - a.votes)
}

export const useFilter = () =>
  useAnecdoteStore((state) => state.filter)

export const useAnecdoteActions = () =>
  useAnecdoteStore((state) => state.actions)

export default useAnecdoteStore
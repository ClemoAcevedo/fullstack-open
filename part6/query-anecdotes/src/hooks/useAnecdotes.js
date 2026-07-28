import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import {
  createAnecdote,
  getAnecdotes,
  updateAnecdote,
} from '../requests'

export const useAnecdotes = (setNotification) => {
  const queryClient = useQueryClient()

  const showNotification = (message) => {
    if (!setNotification) {
      return
    }

    setNotification(message)

    setTimeout(() => {
      setNotification('')
    }, 5000)
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false,
    refetchOnWindowFocus: false,
  })

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,

    onSuccess: (newAnecdote) => {
      queryClient.setQueryData(['anecdotes'], (oldAnecdotes = []) =>
        oldAnecdotes.concat(newAnecdote)
      )

      showNotification(`Created "${newAnecdote.content}"`)
    },

    onError: (error) => {
      showNotification(error.message)
    },
  })

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,

    onSuccess: (updatedAnecdote) => {
      queryClient.setQueryData(['anecdotes'], (oldAnecdotes = []) =>
        oldAnecdotes.map((anecdote) =>
          anecdote.id === updatedAnecdote.id
            ? updatedAnecdote
            : anecdote
        )
      )

      showNotification(`You voted "${updatedAnecdote.content}"`)
    },

    onError: (error) => {
      showNotification(error.message)
    },
  })

  return {
    anecdotes: result.data ?? [],
    isPending: result.isPending,
    isError: result.isError,
    error: result.error,

    addAnecdote: (content) => {
      newAnecdoteMutation.mutate({
        content,
        votes: 0,
      })
    },

    voteAnecdote: (anecdote) => {
      updateAnecdoteMutation.mutate({
        ...anecdote,
        votes: anecdote.votes + 1,
      })
    },
  }
}
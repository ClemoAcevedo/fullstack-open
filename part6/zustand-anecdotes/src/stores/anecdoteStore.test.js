import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}))

import anecdoteService from '../services/anecdotes'
import useAnecdoteStore, {
  useAnecdoteActions,
  useAnecdotes,
} from './anecdoteStore'

beforeEach(() => {
  useAnecdoteStore.setState({
    anecdotes: [],
    filter: '',
  })

  vi.clearAllMocks()
})

describe('useAnecdoteActions', () => {
  it('initializes store from backend', async () => {
    const anecdotes = [
      {
        id: '1',
        content: 'first anecdote',
        votes: 1,
      },
      {
        id: '2',
        content: 'second anecdote',
        votes: 5,
      },
    ]

    anecdoteService.getAll.mockResolvedValue(anecdotes)

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.initialize()
    })

    const { result: anecdotesResult } =
      renderHook(() => useAnecdotes())

    expect(anecdotesResult.current).toEqual([
      anecdotes[1],
      anecdotes[0],
    ])
  })

  it('voting increases votes', async () => {
    const anecdote = {
      id: '1',
      content: 'React',
      votes: 1,
    }

    useAnecdoteStore.setState({
      anecdotes: [anecdote],
    })

    anecdoteService.update.mockResolvedValue({
      ...anecdote,
      votes: 2,
    })

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.vote('1')
    })

    const { result: anecdotesResult } =
      renderHook(() => useAnecdotes())

    expect(anecdotesResult.current[0].votes).toBe(2)
  })
})

describe('useAnecdotes', () => {
  const anecdotes = [
    {
      id: '1',
      content: 'React',
      votes: 1,
    },
    {
      id: '2',
      content: 'Redux',
      votes: 7,
    },
    {
      id: '3',
      content: 'JavaScript',
      votes: 3,
    },
  ]

  beforeEach(() => {
    useAnecdoteStore.setState({
      anecdotes,
      filter: '',
    })
  })

  it('returns anecdotes sorted by votes', () => {
    const { result } = renderHook(() => useAnecdotes())

    expect(result.current).toEqual([
      anecdotes[1],
      anecdotes[2],
      anecdotes[0],
    ])
  })

  it('returns filtered anecdotes', () => {
    useAnecdoteStore.setState({
      anecdotes,
      filter: 'react',
    })

    const { result } = renderHook(() => useAnecdotes())

    expect(result.current).toEqual([
      anecdotes[0],
    ])
  })
})
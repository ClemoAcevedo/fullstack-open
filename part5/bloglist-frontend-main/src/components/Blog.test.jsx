import { render, screen } from '@testing-library/react'
import Blog from './Blog'

const blog = {
  title: 'Testing React',
  author: 'Kent C. Dodds',
  url: 'https://testing-library.com',
  likes: 10,
  user: {
    username: 'johndoe',
    name: 'John Doe',
  },
}

test('unauthenticated user sees blog information and likes but no buttons', () => {
  render(
    <Blog
      blog={blog}
      user={null}
      handleLike={() => { }}
      handleRemove={() => { }}
    />
  )

  expect(screen.getByText(blog.title)).toBeInTheDocument()
  expect(screen.getByText(blog.url)).toBeInTheDocument()
  expect(screen.getByText(`${blog.likes} likes`)).toBeInTheDocument()
  expect(screen.getByText(`added by ${blog.user.name}`)).toBeInTheDocument()

  expect(screen.queryByRole('button')).not.toBeInTheDocument()
})

test('authenticated user who is not the creator sees only the like button', () => {
  const otherUser = {
    username: 'janedoe',
  }

  render(
    <Blog
      blog={blog}
      user={otherUser}
      handleLike={() => { }}
      handleRemove={() => { }}
    />
  )

  expect(
    screen.getByRole('button', { name: /like/i })
  ).toBeInTheDocument()

  expect(
    screen.queryByRole('button', { name: /remove/i })
  ).not.toBeInTheDocument()
})

test('blog creator sees both like and remove buttons', () => {
  const creator = {
    username: 'johndoe',
  }

  render(
    <Blog
      blog={blog}
      user={creator}
      handleLike={() => { }}
      handleRemove={() => { }}
    />
  )

  expect(
    screen.getByRole('button', { name: /like/i })
  ).toBeInTheDocument()

  expect(
    screen.getByRole('button', { name: /remove/i })
  ).toBeInTheDocument()
})
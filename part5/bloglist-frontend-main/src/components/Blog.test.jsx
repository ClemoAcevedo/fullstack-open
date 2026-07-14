import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

const user = {
  username: 'johndoe',
}

test('renders title and author, but not url or likes by default', () => {
  render(
    <Blog
      blog={blog}
      user={user}
      handleLike={() => { }}
      handleRemove={() => { }}
    />
  )

  expect(screen.getByText(blog.title)).toBeInTheDocument()
  expect(screen.getByText(blog.author)).toBeInTheDocument()

  expect(screen.queryByText(`URL: ${blog.url}`)).not.toBeInTheDocument()
  expect(screen.queryByText(/Likes:/)).not.toBeInTheDocument()
})

test('shows url and likes when view button is clicked', async () => {
  const userSetup = userEvent.setup()

  render(
    <Blog
      blog={blog}
      user={user}
      handleLike={() => { }}
      handleRemove={() => { }}
    />
  )

  await userSetup.click(screen.getByRole('button', { name: /view/i }))

  expect(screen.getByText(`URL: ${blog.url}`)).toBeInTheDocument()
  expect(screen.getByText(`Likes: ${blog.likes}`)).toBeInTheDocument()
})

test('calls event handler twice if like button is clicked twice', async () => {
  const userSetup = userEvent.setup()
  const handleLike = vi.fn()

  render(
    <Blog
      blog={blog}
      user={user}
      handleLike={handleLike}
      handleRemove={() => { }}
    />
  )

  // Mostrar los detalles para que aparezca el botón "like"
  await userSetup.click(screen.getByRole('button', { name: /view/i }))

  const likeButton = screen.getByRole('button', { name: /like/i })

  await userSetup.click(likeButton)
  await userSetup.click(likeButton)

  expect(handleLike).toHaveBeenCalledTimes(2)
})

test('calls handleRemove when remove button is clicked', async () => {
  const userSetup = userEvent.setup()
  const handleRemove = vi.fn()

  render(
    <Blog
      blog={blog}
      user={user}
      handleLike={() => { }}
      handleRemove={handleRemove}
    />
  )

  await userSetup.click(screen.getByRole('button', { name: /view/i }))
  await userSetup.click(screen.getByRole('button', { name: /remove/i }))

  expect(handleRemove).toHaveBeenCalledTimes(1)
  expect(handleRemove).toHaveBeenCalledWith(blog)
})
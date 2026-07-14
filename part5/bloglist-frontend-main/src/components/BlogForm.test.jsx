import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('calls the event handler with the right details when a new blog is created', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />)

  const inputs = screen.getAllByRole('textbox')

  await user.type(inputs[0], 'Testing React')
  await user.type(inputs[1], 'Kent C. Dodds')
  await user.type(inputs[2], 'https://testing-library.com')

  await user.click(screen.getByRole('button', { name: /create/i }))

  expect(createBlog).toHaveBeenCalledTimes(1)
  expect(createBlog).toHaveBeenCalledWith({
    title: 'Testing React',
    author: 'Kent C. Dodds',
    url: 'https://testing-library.com',
  })
})
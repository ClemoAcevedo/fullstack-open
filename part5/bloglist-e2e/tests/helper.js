const loginWith = async (page, username, password) => {
  await page.getByRole('button', { name: 'login' }).click()
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  const titleInput = page.getByLabel('Title')

  if (!(await titleInput.isVisible())) {
    await page.getByRole('button', { name: 'new blog' }).click()
  }

  await titleInput.fill(title)
  await page.getByLabel('Author').fill(author)
  await page.getByLabel('URL').fill(url)

  await page.getByRole('button', { name: 'create' }).click()

  await page.getByText(title, { exact: true }).waitFor()
}

module.exports = {
  loginWith,
  createBlog
}
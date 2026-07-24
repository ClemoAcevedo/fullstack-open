const loginWith = async (page, username, password) => {
  await page.getByRole('link', { name: 'login', exact: true }).click()

  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)

  await page.getByRole('button', { name: 'login', exact: true }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('link', { name: 'create', exact: true }).click()

  await page.getByLabel('Title').fill(title)
  await page.getByLabel('Author').fill(author)
  await page.getByLabel('URL').fill(url)

  await page.getByRole('button', { name: 'create', exact: true }).click()

  await page.getByText(title, { exact: true }).waitFor()
}

module.exports = {
  loginWith,
  createBlog
}
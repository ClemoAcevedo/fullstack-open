const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')

    await request.post('/api/users', {
      data: {
        name: 'Superuser',
        username: 'root',
        password: 'sekret'
      }
    })

    await page.goto('/')
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'root', 'sekret')

      await expect(
        page.getByText('Superuser logged in')
      ).toBeVisible()

      await expect(page).toHaveURL('/')
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'root', 'wrong')

      const error = page.locator('.error')

      await expect(error).toContainText(
        'wrong username or password'
      )

      await expect(error).toHaveCSS(
        'border-style',
        'solid'
      )

      await expect(error).toHaveCSS(
        'color',
        'rgb(255, 0, 0)'
      )

      await expect(
        page.getByText('Superuser logged in')
      ).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'root', 'sekret')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(
        page,
        'a blog created by playwright',
        'Clemente',
        'https://example.com'
      )

      await expect(
        page.getByText(
          'a blog created by playwright',
          { exact: true }
        )
      ).toBeVisible()

      await expect(page).toHaveURL('/')
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(
        page,
        'a blog to be liked',
        'Clemente',
        'https://example.com'
      )

      await page
        .getByRole('link', {
          name: 'a blog to be liked'
        })
        .click()

      await expect(
        page.getByText('0 likes')
      ).toBeVisible()

      await page
        .getByRole('button', { name: 'like' })
        .click()

      await expect(
        page.getByText('1 likes')
      ).toBeVisible()
    })

    test('user who created a blog can delete it', async ({ page }) => {
      await createBlog(
        page,
        'a blog to be deleted',
        'Clemente',
        'https://example.com'
      )

      await page
        .getByRole('link', {
          name: 'a blog to be deleted'
        })
        .click()

      page.once('dialog', async dialog => {
        await dialog.accept()
      })

      await page
        .getByRole('button', { name: 'remove' })
        .click()

      await expect(page).toHaveURL('/')

      await expect(
        page.getByText(
          'a blog to be deleted',
          { exact: true }
        )
      ).not.toBeVisible()
    })
  })
})
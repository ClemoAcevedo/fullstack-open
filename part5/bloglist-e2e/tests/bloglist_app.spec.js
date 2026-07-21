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

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'root', 'sekret')

      await expect(page.getByText('Superuser logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'root', 'wrong')

      const error = page.locator('.error')

      await expect(error).toContainText('wrong username or password')
      await expect(error).toHaveCSS('border-style', 'solid')
      await expect(error).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(page.getByText('Superuser logged in')).not.toBeVisible()
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
        page.getByText('a blog created by playwright', { exact: true })
      ).toBeVisible()
    })

    describe('and several blogs exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(
          page,
          'a blog created by playwright 1',
          'Clemente 1',
          'https://example1.com'
        )

        await createBlog(
          page,
          'a blog created by playwright 2',
          'Clemente 2',
          'https://example2.com'
        )

        await createBlog(
          page,
          'a blog created by playwright 3',
          'Clemente 3',
          'https://example3.com'
        )
      })

      test('one of those can be liked', async ({ page }) => {
        const blog = page.locator('.blog').filter({
          hasText: 'a blog created by playwright 2'
        })

        await blog.getByRole('button', { name: 'view' }).click()
        await expect(blog.getByText('Likes: 0')).toBeVisible()

        await blog.getByRole('button', { name: 'like' }).click()
        await expect(blog.getByText('Likes: 1')).toBeVisible()
      })

      test('user who created a blog can delete it', async ({ page }) => {
        const blog = page.locator('.blog').filter({
          hasText: 'a blog created by playwright 2'
        })

        await blog.getByRole('button', { name: 'view' }).click()

        page.once('dialog', async dialog => {
          await dialog.accept()
        })

        await blog.getByRole('button', { name: 'remove' }).click()

        await expect(
          page.getByText('a blog created by playwright 2', { exact: true })
        ).not.toBeVisible()
      })

      test('only the user who created the blog sees the delete button', async ({ page, request }) => {
        const ownBlog = page.locator('.blog').filter({
          hasText: 'a blog created by playwright 2'
        })

        await ownBlog.getByRole('button', { name: 'view' }).click()
        await expect(
          ownBlog.getByRole('button', { name: 'remove' })
        ).toBeVisible()

        await request.post('/api/users', {
          data: {
            name: 'Another user',
            username: 'anotheruser',
            password: 'sekret'
          }
        })

        await page.getByRole('button', { name: 'logout' }).click()
        await loginWith(page, 'anotheruser', 'sekret')

        const otherUsersBlog = page.locator('.blog').filter({
          hasText: 'a blog created by playwright 2'
        })

        await otherUsersBlog.getByRole('button', { name: 'view' }).click()

        await expect(
          otherUsersBlog.getByRole('button', { name: 'remove' })
        ).not.toBeVisible()
      })
      test('blogs are ordered by likes with the most liked first', async ({ page }) => {
        const blog1 = page.locator('.blog').filter({ hasText: 'a blog created by playwright 1' })
        const blog2 = page.locator('.blog').filter({ hasText: 'a blog created by playwright 2' })
        const blog3 = page.locator('.blog').filter({ hasText: 'a blog created by playwright 3' })

        await blog1.getByRole('button', { name: 'view' }).click()
        await blog2.getByRole('button', { name: 'view' }).click()
        await blog3.getByRole('button', { name: 'view' }).click()

        // blog 1 → 1 like
        await blog1.getByRole('button', { name: 'like' }).click()
        await expect(blog1.getByText('Likes: 1')).toBeVisible()

        // blog 2 → 3 likes
        for (let i = 1; i <= 3; i++) {
          await blog2.getByRole('button', { name: 'like' }).click()
          await expect(blog2.getByText(`Likes: ${i}`)).toBeVisible()
        }

        // blog 3 → 2 likes
        for (let i = 1; i <= 2; i++) {
          await blog3.getByRole('button', { name: 'like' }).click()
          await expect(blog3.getByText(`Likes: ${i}`)).toBeVisible()
        }

        const blogs = page.locator('.blog')

        await expect(blogs.nth(0)).toContainText('a blog created by playwright 2')
        await expect(blogs.nth(1)).toContainText('a blog created by playwright 3')
        await expect(blogs.nth(2)).toContainText('a blog created by playwright 1')
      })
    })
  })
})
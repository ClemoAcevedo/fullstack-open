const Blog = ({ blog, user, handleLike, handleRemove }) => {
  if (!blog) {
    return null
  }

  return (
    <div>
      <h2>{blog.title}</h2>

      <p>{blog.url}</p>

      <p>
        {blog.likes} likes{' '}
        {user && (
          <button onClick={() => handleLike(blog)}>
            like
          </button>
        )}
      </p>

      <p>added by {blog.user.name}</p>

      {user && blog.user.username === user.username && (
        <button onClick={() => handleRemove(blog)}>
          remove
        </button>
      )}
    </div>
  )
}

export default Blog
import { useState } from 'react'

const Blog = ({ blog, user, handleLike, handleRemove }) => {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div
      className="blog"
      style={{
        border: '1px solid black',
        padding: '8px',
        marginBottom: '8px',
        borderRadius: '4px'
      }}
    >
      <div className="blog-summary">
        <span>{blog.title}</span> <span>{blog.author}</span>

        <button onClick={() => setShowDetails(prev => !prev)}>
          {showDetails ? 'hide' : 'view'}
        </button>
      </div>

      {showDetails && (
        <div className="blog-details">
          <p>URL: {blog.url}</p>

          <p>
            Likes: {blog.likes}{' '}
            <button onClick={() => handleLike(blog)}>
              like
            </button>
          </p>

          <p>{blog.user.name}</p>

          {blog.user.username === user.username && (
            <button onClick={() => handleRemove(blog)}>
              remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
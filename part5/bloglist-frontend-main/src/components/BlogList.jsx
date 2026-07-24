import { Link } from 'react-router-dom'

const BlogList = ({ blogs }) => {
  return (
    <div>
      <h2>blogs</h2>

      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map(blog => (
          <div
            key={blog.id}
            style={{
              border: '1px solid black',
              padding: '8px',
              marginBottom: '8px',
              borderRadius: '4px'
            }}
          >
            <Link to={`/blogs/${blog.id}`}>
              {blog.title}
            </Link>{' '}
            {blog.author}
          </div>
        ))}
    </div>
  )
}

export default BlogList
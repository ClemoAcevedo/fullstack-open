import {
  Box,
  Link as MuiLink,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import userService from '../services/users'

const Users = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    userService.getAll().then(setUsers)
  }, [])

  return (
    <Box sx={{ maxWidth: 820, mx: 'auto' }}>
      <Typography component="h1" variant="h3" sx={{ mb: 1 }}>
        Users
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Explore the people sharing their favourite reads.
      </Typography>

      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{ overflow: 'hidden' }}
      >
        <Table aria-label="users">
          <TableHead sx={{ bgcolor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'primary.contrastText', fontWeight: 700 }}>
                Name
              </TableCell>
              <TableCell
                align="right"
                sx={{ color: 'primary.contrastText', fontWeight: 700 }}
              >
                Blogs created
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow
                key={user.id}
                sx={{ '&:hover': { bgcolor: 'action.hover' } }}
              >
                <TableCell>
                  <MuiLink
                    component={Link}
                    to={`/users/${user.id}`}
                    underline="hover"
                    sx={{ fontWeight: 600 }}
                  >
                    {user.name}
                  </MuiLink>
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  {user.blogs.length}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default Users

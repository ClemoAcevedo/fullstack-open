import { useQuery } from '@tanstack/react-query'
import userService from '../services/users'

const useUsers = () => useQuery({
  queryKey: ['users'],
  queryFn: userService.getAll,
  staleTime: 5 * 60 * 1000,
})

export default useUsers

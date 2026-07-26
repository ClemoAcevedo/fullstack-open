import { useCounter } from './store'

const Counter = () => {
  const counter = useCounter()

  return <h1>{counter}</h1>
}

export default Counter
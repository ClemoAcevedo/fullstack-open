import { useCounterControls } from './store'

const Controls = () => {
  const { increment, decrement, zero } =
    useCounterControls()

  return (
    <>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={zero}>0</button>
    </>
  )
}

export default Controls
import { useEffect, useState } from 'react'
import Notification from './components/Notification'
import './index.css'
import personService from './services/persons'

const Persons = ({ persons, removePerson }) => {
  return (
    <>
      {persons.map((person) => (
        <p key={person.id}>
          {person.name} {person.number}
          <button onClick={() => removePerson(person.id)}>delete</button>
        </p>
      ))}
    </>
  )
}

const Filter = ({ value, onChange }) => {
  return (
    <div>
      filter shown with <input value={value} onChange={onChange} />
    </div>
  )
}

const PersonForm = ({
  onSubmit,
  nameValue,
  nameOnChange,
  numberValue,
  numberOnChange
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input value={nameValue} onChange={nameOnChange} />
      </div>
      <div>
        number: <input value={numberValue} onChange={numberOnChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService.getAll()
      .then(response => setPersons(response))
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setNewSearch(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()

    const nameExists = persons.some(p => p.name === newName)
    const numberExists = persons.some(p => p.number === newNumber)

    if (numberExists) {
      setErrorMessage('That number is already added to phonebook')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      return
    }

    if (nameExists) {
      const person = persons.find(p => p.name === newName)
      const id = person.id

      if (!window.confirm(`${person.name} is already added to the phonebook, replace old number with a new one?`))
        return

      const changedPerson = { ...person, number: newNumber }

      personService.update(id, changedPerson)
        .then(returnedPerson => {
          setPersons(prevPersons =>
            prevPersons.map(person =>
              person.id === id ? returnedPerson : person
            )
          )
          setNewName('')
          setNewNumber('')
          setSuccessMessage(`Updated ${returnedPerson.name}'s number`)
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
        })
        .catch(error => {
          if (error.response && error.response.data && error.response.data.error) {
            setErrorMessage(error.response.data.error)
          } else {
            setErrorMessage(`Information of ${person.name} has already been removed from server`)
            setPersons(prevPersons =>
              prevPersons.filter(p => p.id !== id)
            )
          }
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })

      return
    }

    const personObject = {
      name: newName,
      number: newNumber,
    }

    personService.create(personObject)
      .then(returnedPerson => {
        setPersons(prevPersons => prevPersons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        setSuccessMessage(`Added ${returnedPerson.name}`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      })
      .catch(error => {
        setErrorMessage(error.response.data.error)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const removePerson = (id) => {
    const person = persons.find(p => p.id === id)

    if (!window.confirm(`Delete ${person.name}?`)) {
      return
    }

    personService.remove(id)
      .then(() => {
        setPersons(prevPersons =>
          prevPersons.filter(p => p.id !== id)
        )
        setSuccessMessage(`Deleted ${person.name}`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      })
      .catch(() => {
        setErrorMessage(`Information of ${person.name} has already been removed from server`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)

        setPersons(prevPersons =>
          prevPersons.filter(p => p.id !== id)
        )
      })
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(newSearch.toLowerCase())
  )

  return (
    <>
      <h2>Phonebook</h2>
      <Notification message={successMessage} type="success" />
      <Notification message={errorMessage} type="error" />
      <Filter value={newSearch} onChange={handleSearchChange} />
      <h3>Add a new</h3>
      <PersonForm
        onSubmit={addPerson}
        nameValue={newName}
        nameOnChange={handleNameChange}
        numberValue={newNumber}
        numberOnChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons persons={personsToShow} removePerson={removePerson} />
    </>
  )
}

export default App
import { useEffect, useState } from 'react'
import CountriesList from './components/CountriesList'
import CountryDetail from './components/CountryDetail'
import Search from './components/Search'
import countryService from './services/countries'

function App() {
  const [value, setValue] = useState('')
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    countryService.getAll().then(data => {
      setCountries(data)
    })
  }, [])

  const handleChange = (event) => {
    setValue(event.target.value)
    setSelectedCountry(null)
  }

  const handleShowCountry = (country) => {
    setSelectedCountry(country)
  }

  const matches = countries.filter(country =>
    country.name.common.toLowerCase().includes(value.toLowerCase())
  )

  return (
    <div>
      <Search value={value} onChange={handleChange} />

      {selectedCountry ? (
        <CountryDetail country={selectedCountry} />
      ) : (
        <>
          {matches.length > 10 && (
            <p>Too many matches, specify another filter</p>
          )}

          {matches.length <= 10 && matches.length > 1 && (
            <CountriesList
              countries={matches}
              onShowCountry={handleShowCountry}
            />
          )}

          {matches.length === 1 && (
            <CountryDetail country={matches[0]} />
          )}
        </>
      )}
    </div>
  )
}

export default App
import { useEffect, useState } from 'react'
import weatherService from '../services/weather'

const Weather = ({ country }) => {
    const [weather, setWeather] = useState(null)

    useEffect(() => {
        setWeather(null)

        weatherService
            .getWeather(country.capital[0])
            .then(data => {
                setWeather(data)
            })
            .catch(error => {
                console.log('Error fetching weather:', error)
            })
    }, [country])

    if (!weather) {
        return <p>Loading weather...</p>
    }

    const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`

    return (
        <div>
            <h2>Weather in {country.capital[0]}</h2>
            <p>Temperature {weather.main.temp} Celsius</p>
            <img
                src={iconUrl}
                alt={weather.weather[0].description}
            />
            <p>Wind {weather.wind.speed} m/s</p>
        </div>
    )
}

export default Weather
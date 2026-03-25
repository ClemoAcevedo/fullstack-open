const CountriesList = ({ countries, onShowCountry }) => {
    return (
        <>
            {countries.map(country => (
                <p key={country.cca3}>
                    {country.name.common}
                    <button onClick={() => onShowCountry(country)}>show</button>
                </p>
            ))}
        </>
    )
}

export default CountriesList
const Header = ({ name }) => <h1>{name}</h1>

const Part = ({ name, exercises }) => (
    <p>
        {name} {exercises}
    </p>
)

const Content = ({ parts }) => (
    <>
        {parts.map(part => <Part key={part.id} name={part.name} exercises={part.exercises} />)}
    </>
)

const Total = ({ parts }) => {

    const total = parts.reduce((acc, part) => acc + part.exercises, 0)

    return (
        <p>Number of exercises {total}</p>
    )
}

const Course = ({ name, parts }) => {
    return (
        <>
            <Header name={name} />
            <Content parts={parts} />
            <Total parts={parts} />
        </>
    )
}

export default Course
const express = require('express')
const app = express()
const Joi = require('joi')
app.use(express.json())

const people = [
    { id: 1, name: 'jeypi' },
    { id: 2, name: 'jose' },
    { id: 3, name: 'Paulo' }
]

app.get('/', (req, res) => {
    res.send('Connected to server')
})

app.get('/api/people', (req, res) => {
    res.send(people)
})

app.post('/api/people', (req, res) => {
   // input validation
    const { error } = validatePerson(req.body)
    if( error ) {
        res.send(error.details[0].message)
        return
    }
    // add person
    const person = {
        id: people.length + 1,
        name: req.body.name
    }

    people.push(person)
    res.send(person)
})

//update persons information
app.put('/api/people/:id', (req, res) => {
    const personId = people.find(c => c.id === parseInt(req.params.id))
    if(!personId) res.status(404).send('The given infomation was not found in the list')

    const { error } = validatePerson(req.body)
    if( error ) {
        res.status(400).send(error.details[0].message)
    }

    personId.name = req.body.name
    res.send(personId)
})


app.delete('/api/people/:id', (req, res) => {
    const personId = people.find(c => c.id === parseInt(req.params.id))
    if(!personId) res.status(404).send('The given infomation was not found in the list')

    const index = people.indexOf(personId)
    people.splice(index, 1)
    res.send(personId)

})


function validatePerson(person) {
    const schema = {
        name: Joi.string().min(3).required()
    }

    return Joi.validate(person, schema)
}



const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

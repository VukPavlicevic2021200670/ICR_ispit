const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

let pets = require('./pets.json')

app.get('/api/pets', (req, res) => {
    let { page = 0, size = 10, name } = req.query
    page = parseInt(page)
    size = parseInt(size)

    let filtered = pets

    if (name) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(name.toLowerCase()))
    }

    const total = filtered.length
    const paged = filtered.slice(page * size, page * size + size)

    res.json({
        content: paged,
        page,
        size,
        totalElements: total,
        totalPages: Math.ceil(total / size)
    })
})

app.get('/api/pets/:id', (req, res) => {
    const pet = pets.find(p => p.id === parseInt(req.params.id))
    if (pet) res.json(pet)
    else res.status(404).send({ error: 'Pet not found' })
})

app.listen(port, () => {
    console.log(`Pet API listening at http://localhost:${port}`)
})

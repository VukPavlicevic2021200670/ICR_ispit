const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

let pets = require('./pets.json')

// server.js
app.get('/api/pets', (req, res) => {
    let { page = 0, size = 10, name, breed } = req.query;
    page = parseInt(page);
    size = parseInt(size);

    let filtered = pets;

    if (name) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(name.toLowerCase()));
    }

    if (breed) {
        filtered = filtered.filter(p => p.breed.toLowerCase().includes(breed.toLowerCase()));
    }

    const totalElements = filtered.length;
    const totalPages = Math.ceil(totalElements / size);
    const content = filtered.slice(page * size, page * size + size);
    const numberOfElements = content.length;

    res.json({
        content,
        pageable: {
            sort: {
                sorted: false,
                empty: true,
                unsorted: true
            },
            pageNumber: page,
            pageSize: size,
            offset: page * size,
            paged: true,
            unpaged: false
        },
        totalPages,
        totalElements,
        last: page >= totalPages - 1,
        size,
        number: page,
        sort: {
            sorted: false,
            empty: true,
            unsorted: true
        },
        numberOfElements,
        first: page === 0,
        empty: numberOfElements === 0
    });
});


app.get('/api/pets/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const pet = pets.find(p => p.id === id);
    if (!pet) return res.status(404).json({ error: 'Pet not found' });
    res.json(pet);
});

app.post('/api/pets/list', (req, res) => {
    const ids = req.body; // expecting an array
    const filtered = pets.filter(p => ids.includes(p.id));
    res.json(filtered);
});


app.listen(port, () => {
    console.log(`Pet API listening at http://localhost:${port}`)
})

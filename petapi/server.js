const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let pets = require('./pets.json');

// Middleware to log requests
app.use((req, res, next) => {
    console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.path}`);
    console.log('Query:', req.query);
    console.log('Body:', req.body);
    next();
});

app.get('/api/pets', (req, res) => {
    try {
        // Parse query parameters with defaults
        let {
            page = 0,
            size = 10,
            name,
            breed,
            origin,
            petSize,
            age,
            priceRange,
            minAge,
            maxAge
        } = req.query;

        page = parseInt(page);
        size = parseInt(size);

        console.log('Processing request with filters:', {
            page, size, name, breed, origin, petSize, age, priceRange, minAge, maxAge
        });

        let filtered = [...pets];
        console.log(`Initial pets count: ${filtered.length}`);

        // Apply filters
        if (name) {
            const searchName = name.toLowerCase().trim();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchName)
            );
            console.log(`After name filter (${name}): ${filtered.length} pets`);
        }

        if (breed) {
            const searchBreed = breed.toLowerCase().trim();
            filtered = filtered.filter(p =>
                p.breed.toLowerCase().includes(searchBreed)
            );
            console.log(`After breed filter (${breed}): ${filtered.length} pets`);
        }

        if (origin) {
            const searchOrigin = origin.toLowerCase().trim();
            filtered = filtered.filter(p =>
                p.origin.toLowerCase().includes(searchOrigin)
            );
            console.log(`After origin filter (${origin}): ${filtered.length} pets`);
        }

        if (petSize) {
            const searchSize = petSize.toLowerCase().trim();
            filtered = filtered.filter(p =>
                p.size.toLowerCase() === searchSize
            );
            console.log(`After size filter (${petSize}): ${filtered.length} pets`);
        }

        if (age) {
            const searchAge = parseInt(age);
            filtered = filtered.filter(p => p.age === searchAge);
            console.log(`After exact age filter (${age}): ${filtered.length} pets`);
        }

        // Age range filtering (either from age range or min/max)
        if (minAge || maxAge) {
            const min = minAge ? parseInt(minAge) : 0;
            const max = maxAge ? parseInt(maxAge) : 100;
            filtered = filtered.filter(p => p.age >= min && p.age <= max);
            console.log(`After age range filter (${min}-${max}): ${filtered.length} pets`);
        } else if (age && age.includes('-')) {
            const [min, max] = age.split('-').map(Number);
            filtered = filtered.filter(p => p.age >= min && p.age <= (max || 100));
            console.log(`After age range filter (${age}): ${filtered.length} pets`);
        }

        if (priceRange) {
            const searchPrice = priceRange.toLowerCase().trim();
            filtered = filtered.filter(p =>
                p.priceRange.toLowerCase() === searchPrice
            );
            console.log(`After price filter (${priceRange}): ${filtered.length} pets`);
        }

        // Pagination
        const totalElements = filtered.length;
        const totalPages = Math.ceil(totalElements / size);
        const content = filtered.slice(page * size, page * size + size);
        const numberOfElements = content.length;

        console.log('Pagination results:', {
            page,
            size,
            totalElements,
            totalPages,
            contentLength: content.length
        });

        res.json({
            content,
            pageable: {
                sort: { sorted: false, empty: true, unsorted: true },
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
            sort: { sorted: false, empty: true, unsorted: true },
            numberOfElements,
            first: page === 0,
            empty: numberOfElements === 0
        });

    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Keep other endpoints unchanged
app.get('/api/pets/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const pet = pets.find(p => p.id === id);
    if (!pet) return res.status(404).json({ error: 'Pet not found' });
    res.json(pet);
});

app.post('/api/pets/list', (req, res) => {
    const ids = req.body;
    const filtered = pets.filter(p => ids.includes(p.id));
    res.json(filtered);
});

app.listen(port, () => {
    console.log(`Pet API listening at http://localhost:${port}`);
    console.log('Available filters:');
    console.log('- name (string)');
    console.log('- breed (string)');
    console.log('- origin (string)');
    console.log('- size (Small/Medium/Large/Extra Large)');
    console.log('- age (number or min-max range)');
    console.log('- priceRange (cheap/affordable/expensive/luxury)');
    console.log('- minAge & maxAge (alternative to age range)');
});
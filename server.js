// Dependencies

require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')

const app = express()
const PORT = process.env.PORT
const uri = process.env.DATABASEURL

const Book = require('./models/BookModel')

//Database connection

mongoose.connect(uri)

const db = mongoose.connection

db.on('error', (error) => console.log(error.message, `Database has an error`))
db.on('connected', () => console.log(`Database has successfully connected`))
db.on('disconnected', () => console.log(`Database has disconnected`))


//Middleware

app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"));
app.set("view engine", "ejs")
app.use(methodOverride('_method'))

//Routes

//Home
app.get('/', (req, res) => {
    res.status(200).render("home.ejs")
})


// Index
app.get('/books', async (req, res) => {
    // res.render("index.ejs")
    try {
        const allBooks = await Book.find({})
        res.render("index.ejs", {
            books: allBooks
        });

    } catch (error) {
        console.error(error)
        res.status(500).send(error)
    }

})


// New
app.get('/books/new', (req, res) => {
    res.render('new.ejs')
})

// Delete
app.delete('/books/:id', async (req, res) => {
    try {
        const id = req.params.id
        const bookToDelete = await Book.findByIdAndDelete(id)
        res.redirect('/books')
    } catch (error) {
        console.log(error)
    }
})
// Update


//Create 

app.post('/books', (req, res) => {
    // Checking for completed "checke off" book.
    if (req.body.completed === 'on') {
        req.body.completed = true;
    } else {
        req.body.completed = false;
    }

    Book.create(req.body)
        .then(createdBook => {
            console.log('Book has successfuly been created!')
            console.log(req.body)
            res.redirect("/books")
        }).catch(error => {
            console.error('Error Creating Book!')
            res.status(500).send("ISSUE CREATING BOOK!")
        })

});

// Edit

//Show
app.get('/books/:id', async (req, res) => {
    try {
        let id = req.params.id

        const book = await Book.findById(id)

        res.render("show.ejs", {
            book: book
        })

    } catch (error) {
        console.log(error)
    }
})

//Ports
app.listen(PORT, () => {
    console.log(`Lstening to server on http://localhost:${PORT}`)
})
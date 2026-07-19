// Dependencies

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT;
const uri = process.env.DATABASEURL;
const secret = process.env.JWTSECRET;
const expiration = process.env.EXPIRE;

const Book = require('./models/BookModel');
const User = require('./models/UserModel');

//Database connection

mongoose.connect(uri);

const db = mongoose.connection;

db.on('error', (error) => console.log(error.message, `Database has an error`));
db.on('connected', () => console.log(`Database has successfully connected`));
db.on('disconnected', () => console.log(`Database has disconnected`));


//Middleware

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(methodOverride('_method'));

//Routes

//Home
app.get('/', (req, res) => {
    res.status(200).render("home.ejs");
});


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
        res.status(500).send(`There was an error getting all books`);
    };

});

app.post('/api/users/login', async (req, res) => {
    try {
        const foundUser = await User.findOne({ email: req.body.email });

        if (!foundUser) {
            return res.status(400).json({ message: "Incorrect email or password" });
        };

        const correctPassword = await foundUser.isCorrectPassword(req.body.password);

        if (!correctPassword) {
            return res.status(400).json({ message: "Incorrect email or password" });
        };

        const payload = {
            _id: foundUser._id,
            username: foundUser.username
        };
        const token = jwt.sign(payload, secret, { expiresIn: expiration })
        res.json({ token })

    } catch (error) {
        res.status(400).json(error.message)
    }
})


// New
app.get('/books/new', (req, res) => {
    res.render('new.ejs')
})

// Delete
app.delete('/books/:id', async (req, res) => {
    try {
        const bookToDelete = await Book.findByIdAndDelete(req.params.id)
        res.redirect('/books')
    } catch (error) {
        console.log(error)
        res.status(500).send(`Error deleting book`)
    }
})
// Update
app.put('/books/:id', async (req, res) => {

    if (req.body.completed === 'on') {
        req.body.completed = true;
    } else {
        req.body.completed = false;
    }

    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec()

        res.redirect(`/books/${req.params.id}`)
    } catch (error) {
        console.log(error)
        res.status(500).send(`Book is not able to be updated`)
    }
})


//Create 

app.post('/api/users/register', async (req, res) => {

    const { username, email, password } = req.body;

    const exsitingUser = await User.findOne({ email });

    if (exsitingUser) {
        return res.status(400).json({ error: 'A user with this email already exists' });
    };

    try {
        const user = await User.create({ username, email, password })
        res.status(201).json({ message: `A new User was created successfully` })

    } catch (error) {
        res.status(400).json(error.message)
    }

})

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

app.get('/books/:id/edit', async (req, res) => {
    try {
        const foundBook = await Book.findById(req.params.id)
        if (!foundBook) {
            return res.status(404).send(`Book not found!`)
        }

        res.render("edit.ejs", {
            book: foundBook
        })
    } catch (error) {
        console.log(error)
        res.status(500).send(`Issue showing the edit page`)
    }
})

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
        res.status(500).send(`Not able to get book you are looking for`)
    }
})

//Ports
app.listen(PORT, () => {
    console.log(`Lstening to server on http://localhost:${PORT}`)
})
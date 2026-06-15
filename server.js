// Dependancies

require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

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

//Routes
app.get('/', (req, res) => {
    res.status(200).send(`welcome to my library where I reflect on the books I have read and take suggestions `)
})

app.post('/book', (req, res) => {

    if (req.body.completed === 'on') {
        req.body.completed = true
    } else {
        req.body.completed = false
    }

    Book.create(req.body).then((createdBook) => {
        console.log(`Book was created`)
    }).catch(err => {
        console.log(err, `<<<<<========= ERROR!!!!`)
    })

    res.send(req.body)
})

//Ports
app.listen(PORT, () => {
    console.log(`Lstening to server on http://localhost:${PORT}`)
})
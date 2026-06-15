// Dependancies

require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const app = express()
const PORT = process.env.PORT
const uri = process.env.DATABASEURL

//Database connection

mongoose.connect(uri)

const db = mongoose.connection

db.on('error', (error)=> console.log(error.message,`Database has an error`))
db.on('connected', ()=> console.log(`Database has successfully connected`))
db.on('disconnected', ()=> console.log(`Database has disconnected`))


//Middleware



//Routes
app.get('/', (req,res)=>{
    res.status(200).send(`welcome to my library where I reflect on the books I have read and take suggestions `)
})

app.post('/book', (req, res)=>{
    res.send(`books recieved`)
})

//Ports
app.listen(PORT, ()=>{
    console.log(`Lstening to server on http://localhost:${PORT}`)
})
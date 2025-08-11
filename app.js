const dotenv = require('dotenv').config();
const express = require('express');
const morgan = require('morgan')
const fs = require('fs');
const path = require('path');
const dbcon = require('./app/config/db')
dbcon()

const app = express()

const accessLogStrem = fs.createWriteStream(
    path.join(__dirname,'access.log'),
    {flags: 'a'}
)


app.use(express.json())
app.use(morgan('dev'));
app.use(morgan('combined',{ stream: accessLogStrem}));




app.listen(3000, ()=>{
    console.log('Server is running on port ',3000)
})

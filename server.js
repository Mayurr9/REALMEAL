require('dotenv').config()
const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const expresslayouts = require('express-ejs-layouts');
const PORT = process.env.PORT || 3300;
const mongoose = require('mongoose');
const { watch } = require('fs');
const session = require('express-session')
const flash = require('express-flash');
const { collection } = require('./app/models/menu');
const MongoStore = require('connect-mongo')


//database connection
const url = 'mongodb://localhost/realmeal';
// Database connection
mongoose.connect(url, {});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database connected...');
}).catch(err => {
    console.log('Connection failed...')
});

// //session store
// let mongoStores = new MongoStore ({
//     mongooseConnection: connection,
//     collection: 'sessions'
// })

// // Session Config
// app.use(
//     session({
//         secret: 'story book',
//         resave: false,
//         saveUninitialized: false,
//         cookie: { maxAge: 1000 * 60 * 60 * 24}, //24 hours
//         store: MongoStores.create({
//             mongoUrl: url
//         })
//     })
// );



app.use(flash())
//ASSETS
app.use(express.static('public'))

// set template engine
app.use(expresslayouts)
app.set('views', path.join(__dirname,'/resources/views'))
app.set('view engine', 'ejs');

require('./routes/web')(app)

app.listen(PORT , () => {
    console.log(`listening on port ${PORT}`);
})
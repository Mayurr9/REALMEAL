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
const axios = require('axios');
const passport = require('passport')
const Emitter = require('events')

// Database connection
const url = 'mongodb://localhost/realmeal';
mongoose.connect(url, { useNewUrlParser: true, useCreateIndex:true, useUnifiedTopology: true, useFindAndModify : true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database connected...');
}).catch(err => {
    console.log('Connection failed...')
});


// Session Config
app.use(
    session({
        secret:process.env.COOKIE_SECRET,
        resave: false,
        store: MongoStore.create({
           mongoUrl: process.env.MONGO_URL
       }),
        saveUninitialized: false,
        cookie: { maxAge: 1000 * 60 * 60 * 24}, //24 hours
    })
);


//event emitter
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)

//passport config
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())


app.use(flash())
//ASSETS
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false}))
app.use(express.json())

//Global middleware
app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})

// set template engine
app.use(expresslayouts)
app.set('views', path.join(__dirname,'/resources/views'))
app.set('view engine', 'ejs');

require('./routes/web')(app)
app.use((req, res)=>{
    res.status(404).render('error404')
})

const server =app.listen(PORT , () => {
    console.log(`listening on port ${PORT}`);
})

//socket 
const io = require('socket.io')(server)
io.on('connection', (socket) => {
    //join
    socket.on('join', (OrderId) => {
        // console.log(OrderId + "here")
        socket.join(OrderId)
    })
})


eventEmitter.on('orderUpdated', (data) => {
    io.to(`Order_${data.id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced', data)
})



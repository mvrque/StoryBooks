const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan') //http request logger middleware, helpful for debugging or creating Log files
const exphbs = require('express-handlebars') //view engine
const passport = require('passport')
const session = require('express-session')  
const MongoStore = require('connect-mongo')(session)  //session is a middleware, saves the session in the DB
const connectDB = require('./config/db')



//Load config
dotenv.config( {path: './config/config.env' })

//Passport config
require('./config/passport')(passport)

//connect to DB
connectDB()

const app = express()

//Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//Handlebars
app.engine('.hbs', exphbs.engine({defaultLayout:'main', extname: '.hbs'}))
app.set('view engine', 'hbs')

//Sessions middleware (ABOVE PASSPORT MIDDLEWARE!!!!!)
app.use(session({
    secret: 'keyboard cat',
    resave: false,  //dont save the session if nothing is modified
    saveUninitialized: false,  //dont create session until something is stored
    store: new MongoStore({ mongooseConnection: mongoose.connection})  //saves current session to DB ( cookie, passport, userid for this login, if refreshes the dashboard page, wont log out)

}))

//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Static folder
app.use(express.static(path.join(__dirname, 'public')))

//Routes 
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))


const PORT = process.env.PORT || 4000 //using variables in the config

app.listen(PORT, console.log(`Server Running In ${process.env.NODE_ENV} mode on port ${PORT}`))
const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan') //http request logger middleware, helpful for debugging or creating Log files
const exphbs = require('express-handlebars') //view engine
const methodOverride = require('method-override')
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

//Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())


//Method override
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  }))


//Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//Handlebars helpers
const { formatDate, stripTags, truncate, editIcon, select } = require('./helpers/hbs')


//Handlebars
app.engine('.hbs', exphbs.engine({ helpers: {
    formatDate,
    stripTags,
    truncate,
    editIcon,
    select
}, defaultLayout:'main', extname: '.hbs'}))
app.set('view engine', 'hbs')

//Sessions middleware (ABOVE PASSPORT MIDDLEWARE!!!!!)
app.use(
    session({
        secret: 'keyboard cat',
        resave: false,  //dont save the session if nothing is modified
        saveUninitialized: false,  //dont create session until something is stored
        store: new MongoStore({ mongooseConnection: mongoose.connection})  //saves current session to DB ( cookie, passport, userid for this login, if refreshes the dashboard page, wont log out)

}))

//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Set global variable
app.use(function(req, res, next){
    res.locals.user = req.user  || null //access user within our templates
    next()
})

//Static folder
app.use(express.static(path.join(__dirname, 'public')))

//Routes 
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))


const PORT = process.env.PORT || 4000 //using variables in the config

app.listen(PORT, console.log(`Server Running In ${process.env.NODE_ENV} mode on port ${PORT}`))
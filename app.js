
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
const exphbs = require('express-handlebars')
const express = require('express')
const handlebars = require('handlebars')
const handlebarsIntl = require('handlebars-intl')
const handlebarsPaginate = require('handlebars-paginate')
const flash = require('connect-flash')
const passport = require('passport')


const app = express()


app.use(require('express-session')({
    secret: 'SOMETHING SECRET',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
}))
app.use(flash())
app.use(cookieParser())


app.use(passport.initialize())
app.use(passport.session())


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


const staticDir = express.static(__dirname + '/public')
app.use('/public', staticDir)


handlebarsIntl.registerWith(handlebars)
handlebars.registerHelper('paginate', handlebarsPaginate)
app.engine('handlebars', exphbs.create({ defaultLayout: 'main' }).engine)
app.set('view engine', 'handlebars')


const configRoutes = require('./routes')
configRoutes(app)


app.listen(process.env.PORT ?? 3000, () => {
    console.log('We\'ve now got a server')
    console.log('Your routes will be running on http://localhost:' + (process.env.PORT ?? 3000))
})

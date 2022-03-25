
const passport = require('../config/passport-users')
const paymentsRoutes = require('./payments')
const homeRoutes = require('./home')
const productsRoutes = require('./products/products-dao')
const supportsRoutes = require('./supports')
const usersRoutes = require('./users')

const mainRoutes = (app) => {


    app.use('/$/', homeRoutes)


    app.use('/payment', paymentsRoutes)    // payments routes
    app.use('/product', productsRoutes)    // products routes
    app.use('/support', supportsRoutes)    // supports routes
    app.use('/user', usersRoutes)          // user routes


    app.use('*', (req, res) => {
        res.render('alerts/error', {
            mainTitle: 'Не найдено',
            code: 404,
            message: `Не найдено`,
            url: req.originalUrl,
            user: req.user,
        })
    })
}

module.exports = mainRoutes

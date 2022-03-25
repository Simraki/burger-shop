
const express = require('express')
const supportsRouter = express.Router()


supportsRouter.use('/contact-us', require('./dao/contact-us'))			// url: ~/support/contact-us
supportsRouter.use('/subscription', require('./dao/subscribe-us'))		// url: ~/support/subscription


supportsRouter.use('*', (req, res) => {
    res.render('alerts/error', {
        mainTitle: 'Не найдено',
        code: 404,
        message: `Не найдено`,
        url: req.originalUrl,
        user: req.user,
    })
})

module.exports = supportsRouter

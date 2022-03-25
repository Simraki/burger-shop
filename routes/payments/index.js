
const express = require('express')
const paymentsRouter = express.Router()


paymentsRouter.use('/gateway', require('./payment-gateway'))				// url: ~/payment/gateway
paymentsRouter.use('/confirmation', require('./payment-confirmation'))		// url: ~/payment/confirmation
paymentsRouter.use('/checkout', require('../products/product-checkout'))	// url: ~/payment/checkout


paymentsRouter.use('*', (req, res) => {
    res.render('alerts/error', {
        mainTitle: 'Не найдено',
        code: 404,
        message: `Не найдено`,
        url: req.originalUrl,
        user: req.user,
    })
})

module.exports = paymentsRouter

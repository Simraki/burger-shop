
const express = require('express')
const usersRouter = express.Router()


usersRouter.use('/login', require('./auth/user-login-account'))					// url: ~/user/login
usersRouter.use('/logout', require('./auth/user-logout-account'))					// url: ~/user/logout
usersRouter.use('/forget-password', require('./auth/user-forget-password'))		// url: ~/user/forget-password


usersRouter.use('/new', require('./dao/create-new-user'))							// url: ~/user/new
usersRouter.use('/update/info', require('./dao/update-user-info'))					// url: ~/user/update/info
usersRouter.use('/update/card', require('./dao/update-user-card'))					// url: ~/user/update/card
usersRouter.use('/update/cart', require('./dao/update-user-cart'))					// url: ~/user/update/cart
usersRouter.use('/update/wallet', require('./dao/update-user-wallet'))				// url: ~/user/update/wallet


usersRouter.use('/dashboard', require('./gui/user-dashboard'))						// url: ~/user/dashboard
usersRouter.use('/dashboard/account', require('./gui/user-account'))				// url: ~/user/dashboard/account
usersRouter.use('/dashboard/cart', require('./gui/user-cart'))						// url: ~/user/dashboard/cart
usersRouter.use('/dashboard/order-history', require('./gui/user-orders'))			// url: ~/user/dashboard/order-history
usersRouter.use('/dashboard/payments', require('./gui/user-card'))					// url: ~/user/dashboard/payment
usersRouter.use('/dashboard/wallet', require('./gui/user-wallet'))					// url: ~/user/dashboard/wallet


usersRouter.use('*', (req, res) => {
    res.render('alerts/error', {
        mainTitle: 'Не найдено',
        code: 404,
        message: `Не найдено`,
        url: req.originalUrl,
        user: req.user,
    })
})

module.exports = usersRouter

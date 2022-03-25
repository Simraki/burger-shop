


const express = require('express')
const router = express.Router()
const data = require('../../../data')
const usersData = data.users
const passport = require('../../../config/passport-users')



//------ check user authenticity
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    } else {
        res.render('alerts/error', {
            mainTitle: 'Не найдено',
            code: 404,
            message: 'Не найдено',
            url: req.originalUrl,
            user: req.user,
        })
    }
}

//------------------------ route to fetch user information by email id
router.get('/', isLoggedIn, (req, res) => {

    let totalCost = 0
    let taxes = 0
    let netCost = 0

    for (let i = 0; i < req.user.cart.length; i++) {
        totalCost += req.user.cart[ i ].total
    }

    totalCost = Math.round(totalCost * 100) / 100
    taxes = Math.round(totalCost * 3) / 100
    netCost = Math.round((totalCost + taxes) * 100) / 100

    res.render('users/gui/user-cart', {
        mainTitle: 'Карты',
        user: req.user,
        total: totalCost,
        tax: taxes,
        net: netCost,
    })
})

// exporting routing apis
module.exports = router

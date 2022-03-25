

const express = require('express')
const router = express.Router()
const xss = require('xss')
const data = require('../../../data')
const usersData = data.users
const usersCartData = data.usersCart
const productData = data.products
const passport = require('../../../config/passport-users')



//------ user authentication validation
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    } else {
        res.render('users/auth/user-login-account', {
            mainTitle: 'Авторизация',
            url: `/user/dashboard/cart`,
        })
    }
}


//------------------------ route to update user information by id
router.get('/', isLoggedIn, (req, res) => {
    res.render('alerts/error', {
        mainTitle: 'Неверный запрос',
        code: 400,
        message: 'Нет такого продукта',
        url: req.originalUrl,
        user: req.user,
    })
})

// exporting routing apis
module.exports = router




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
    res.render('users/gui/user-card', {
        mainTitle: 'Карты',
        user: req.user,
    })
})

// exporting routing apis
module.exports = router

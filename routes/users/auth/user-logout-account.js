


const express = require('express')
const router = express.Router()
const passport = require('../../../config/passport-users')
const passportLogout = require('express-passport-logout')



//------ check user authenticity
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/')
    } else {
        return next()
    }
}


//------------------------ route to fetch user information by id
router.get('/', isLoggedIn, (req, res) => {
    res.redirect('/user/login')
})

//------------------------ routing for login form submit
router.post('/', (req, res) => {
    req.logOut()
    res.redirect('/user/login')
})

// exporting routing apis
module.exports = router

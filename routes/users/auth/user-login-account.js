


const express = require('express')
const router = express.Router()
const xss = require('xss')
const validator = require('validator')
const data = require('../../../data')
const usersData = data.users
const credentialsData = data.credentials
const passport = require('../../../config/passport-users')
const emailToLowerCase = require('../comp/email-case-converter').emailToLowerCase



//------ user authentication validation
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/user/dashboard')
    } else {
        return next()
    }
}

//------ user email validation
function isValid(req, res, next) {
    let email = emailToLowerCase(xss(req.body.email))
    let password = xss(req.body.password)

    if (email.length == 0) {
        res.status(404).send({ error: 'Нет Email' })
    } else if (password.length == 0) {
        res.status(404).send({ error: 'Нет пароля' })
    }

    // validating email syntax
    if (!validator.isEmail(email)) {
        res.status(404).send({ error: 'Неправильный Email.' })
        return
    }

    credentialsData.getCredentialById(email).then((userCredentials) => {
        if (userCredentials == null) {      // no user document found
            res.status(404).send({ error: 'Этот Email не зарегистрирован' })
        } else {    // document found and comparing credentials
            credentialsData.compareCredential(email, password)
                .then(() => {
                    next()     // sent for user authentication
                })
                .catch((error) => {     // credentials mismatched error
                    res.status(400).send({ error: 'Неправильный пароль' })
                })
        }
    })
}


//------------------------ route to fetch user information by email id
router.get('/', isLoggedIn, (req, res) => {
    req.flash('loginFlash')

    if (req.session.flash[ 'error' ] === undefined) {
        res.render('users/auth/user-login-account', {
            mainTitle: 'Авторизация',
            url: '/user/dashboard',
            error: req.session.flash.error,
        })
    } else {
        res.render('users/auth/user-login-account', {
            mainTitle: 'Авторизация',
            error: req.session.flash.error.slice(-1)[ 0 ],
        })
    }
})

//------------------------ routing for login form submit
router.post('/', isValid, (req, res) => {
    let user = {    // create 'user' object
        email: emailToLowerCase(xss(req.body.email)),
        password: xss(req.body.password),
    }

    passport.authenticate('user')(req, res, function () {   //authenticate user
        res.json({ success: true, url: req.url })
    })
})



// exporting routing apis
module.exports = router

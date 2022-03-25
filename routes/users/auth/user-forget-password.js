


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

//------ user email verification
function isValid(req, res, next) {
    let email = emailToLowerCase(xss(req.body.email))

    if (email.length == 0) {
        res.status(404).send({ error: 'Нет Email' })
    }

    // validating email syntax
    if (!validator.isEmail(email)) {
        res.status(404).send({ error: 'Неправильный Email' })
        return
    }

    credentialsData.getCredentialById(email).then((userCredentials) => {
        if (userCredentials == null) {  	// no user document found
            res.status(404).send({ error: 'Этот Email не зарегистрирован' })
        } else {
            next()
        }
    })
        .catch((error) => { 	// credentials mismatched error
            res.json({ error: error })
        })
}


//------------------------ route to fetch user information by email id
router.get('/', isLoggedIn, (req, res) => {
    res.render('users/auth/user-forget-password', {
        mainTitle: 'Забыли пароль',
    })
})

//------------------------ routing for login form submit
router.post('/', isValid, (req, res) => {
    let email = emailToLowerCase(xss(req.body.email))

    // generating new random password
    credentialsData.generateCredential(email).then((genPass) => {
        req.body[ 'password' ] = genPass
        res.json(req.body)
    })
})

// exporting routing apis
module.exports = router

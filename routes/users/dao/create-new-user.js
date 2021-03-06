/*
 * Users Routers *
 * Users Data Access Object *
 * Create User *

 * Functionalities Index:
        =========================================================================================================
        | S.No. |  Type  |        URL        |   Function Call   | Controller |           Description           |
        =========================================================================================================
        |   1.  | Get    | /user/new         | createNewUser     | ***        | Render a page for new user form |
        ---------------------------------------------------------------------------------------------------------
        |   2.  | Post   | /user/new         | createNewUser     | users      | Insert/create new user record   |
        ---------------------------------------------------------------------------------------------------------
*/

/* importing required files and packages */
const express = require('express')
const router = express.Router()
const xss = require('xss')
const validator = require('validator')
const data = require('../../../data')
const usersData = data.users
const credentialsData = data.credentials
const passport = require('../../../config/passport-users')
const emailToLowerCase = require('../comp/email-case-converter').emailToLowerCase

/* local scoped function */

//------ user authentication validation
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/user/dashboard')
    } else {
        return next()
    }
}

/* global scoped function */
//------------------------ route to render to create new user form
router.get('/', isLoggedIn, (req, res) => {
    res.render('users/auth/create-new-account', {
        mainTitle: 'Регистрация',
    })
})

//------------------------ route to create new user into database
router.post('/', (req, res) => {
    let newUser = req.body

    console.log('1001010101')
    console.log(newUser)

    let name = xss(newUser.name)
    let email = emailToLowerCase(xss(newUser.email))
    let mobile = xss(newUser.mobile)
    let password = xss(newUser.password)

    // checking null values
    if (!name) {
        res.render('users/auth/create-new-account', {
            mainTitle: 'Регистрация',
            error: 'Нет имени',
        })
        return
    } else if (!email) {
        res.render('users/auth/create-new-account', {
            mainTitle: 'Регистрация',
            error: 'Нет Email',
        })
        return
    } else if (!mobile) {
        res.render('users/auth/create-new-account', {
            mainTitle: 'Регистрация',
            error: 'Не указан номер телефона',
        })
        return
    } else if (!password) {
        res.render('users/auth/create-new-account', {
            mainTitle: 'Регистрация',
            error: 'Не указан  пароль',
        })
        return
    }

    // validating email syntax
    if (!validator.isEmail(email)) {
        res.status(404).send({ error: 'Неправильный Email.' })
        return
    }

    // searching for an existing user
    usersData.getUserById(email).then((userJsonDocument) => {

        if (userJsonDocument == null) {     // validating received document whether user exist or not
            usersData.createNewUser(name, email, mobile).then((createUserDocument) => {
                credentialsData.createNewCredential(email, password).then((userCredential) => {

                    let user = {    // create 'user' object
                        email: email,
                        password: password,
                    }

                    passport.authenticate('user')(req, res, function () {   //authenticate user
                        res.json({ success: true })
                    })

                })
            })
        } else {    // rendering error page if user already exists
            res.status(400).send({ error: 'Этот Email уже зарегистрирован' })
        }
    })
        .catch((error) => {   // rendering error page
            res.render('alerts/error', {
                mainTitle: 'Ошибка сервера',
                code: 500,
                message: error,
                url: req.originalUrl,
                user: req.user,
            })
        })
})

// exporting routing apis
module.exports = router

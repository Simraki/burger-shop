/*
 * Users Routers * Users Configuration *
 * Users Updates *
 * This route file contains apis for user information update operations
 * Functionalities Index:
        ======================================================================================================
        | S.No. |  Type  |          URL         |   Function Call   | Controller |       Description         |
        ======================================================================================================
        |   1.  | Get    | /user/update/:email  | updateUser        | ***        | Page for update user form |
        ------------------------------------------------------------------------------------------------------
        |   2.  | Post   | /user/update/        | updateUser        | users      | Update user profile info  |
        ------------------------------------------------------------------------------------------------------
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

/* local scoped function */

//------ user authentication validation
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    } else {
        res.render('alerts/error', {
            mainTitle: 'Неверный запрос',
            code: 400,
            message: 'Неавторизованный запрос',
            url: req.originalUrl,
            user: req.user,
        })
    }
}

/* global scoped function */
//------------------------ route to update user information by id
router.post('/', isLoggedIn, (req, res) => {

    let userUpdates = req.body
    let email = xss(req.user._id)

    if (Object.keys(userUpdates).length === 0 || userUpdates == undefined) {    // check for empty json passed
        res.status(400).json({ error: 'Нет информации о пользователе' })
    } else if (!validator.isEmail(email)) {     // validating email syntax
        res.status(400).json({ error: 'Неправильный Email' })
    } else {

        // validating user existance
        usersData.getUserById(email).then((userJsonDocument) => {
            credentialsData.getCredentialById(email).then((credentialJsonDocument) => {

                // checking for user profile updates
                if (userUpdates.name || userUpdates.mobile) {
                    usersData.updateProfile(email, xss(userUpdates.name), xss(userUpdates.mobile)).then((userInfo) => {
                        req.user.alias = userInfo.alias
                        res.json({ success: true })
                    })
                }

                // checking for user security updates
                if (userUpdates.password) {
                    let savedPassword = credentialJsonDocument.password

                    credentialsData.updateCredential(email, xss(userUpdates.password), savedPassword).then((updateStatus) => {
                        if (updateStatus) {
                            res.json({ success: true })
                        } else {
                            res.json({
                                success: false,
                                error: 'Новый пароль должен быть отличным от старого',
                            })
                        }
                    })
                }

            })
        })
            .catch((error) => {     // rendering error page
                res.render('alerts/error', {
                    mainTitle: 'Ошибка сервера',
                    code: 500,
                    message: error,
                    url: req.originalUrl,
                    user: req.user,
                })
            })
    }
})

// exporting routing apis
module.exports = router

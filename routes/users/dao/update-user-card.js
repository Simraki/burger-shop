
/* importing required files and packages */
const express = require('express')
const router = express.Router()
const xss = require('xss')
const data = require('../../../data')
const usersData = data.users
const usersCardData = data.usersCard
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
        res.status(400).json({ error: 'Нет информации о карте' })
    } else if (!userUpdates.username) {
        res.status(400).json({ error: 'Нет кардхолдера' })
    } else if (!userUpdates.number) {
        res.status(400).json({ error: 'Нет номера карты' })
    } else if (!userUpdates.type) {
        res.status(400).json({ error: 'Нет типа карты' })
    } else if (!userUpdates.exp) {
        res.status(400).json({ error: 'Нет срока карты' })
    } else if (!userUpdates.cvv) {
        res.status(400).json({ error: 'Нет CVV' })
    }

    usersCardData.getAllCard(email).then((cardInfo) => {

        let len = cardInfo.card.length
        let exist = false

        for (let i = 0; i < len; i++) {
            if (cardInfo.card[ i ]._id === xss(userUpdates.number)) {
                exist = true
                break
            }
        }

        if (exist == false) {
            usersCardData.addCard(email, userUpdates).then(() => {
                res.status(200).json({ success: true })
            })
        } else {
            res.status(400).json({ error: 'Эта карта уже сохранена' })
        }

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
})

//------------------------ route to delete user information by id
router.delete('/', isLoggedIn, (req, res) => {

    let cardId = xss(req.body.cardNumber)
    let email = xss(req.user._id)

    usersCardData.deleteCard(email, cardId).then(() => {
        res.json({ success: true })
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
})

// exporting routing apis
module.exports = router

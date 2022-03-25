/*
 * Users Routers *
 * Users Data Access Object *
 * User Wallet *

 * Functionalities Index:
        ========================================================================================================================
        | S.No. |  Type  |         URL         |   Function Call   | Controller |                  Description                 |
        ========================================================================================================================
        |   1.  | Put    | /user/update/wallet | addCash           | usersCard  | Update wallet amount without payment gateway |     |
        ------------------------------------------------------------------------------------------------------------------------
		|   2.  | Post   | /user/update/wallet | addCash           | usersCard  | Update wallet amount with payment gateway    |
        ------------------------------------------------------------------------------------------------------------------------

*/

/* importing required files and packages */
const express = require('express')
const router = express.Router()
const xss = require('xss')
const data = require('../../../data')
const usersData = data.users
const usersCardData = data.usersCard
const usersWalletData = data.usersWallet
const walletTransaction = data.transactionWallet
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
//------------------------ route to quickly update wallet amount by user id without payment gatewaty
router.put('/', isLoggedIn, (req, res) => {

    let email = xss(req.user._id)
    let amount = xss(req.body.amount)
    let cardUsed = xss(req.body.cardUsed)
    let remark = xss(req.body.description)
    let status = remark === 'Пополнение' ? 'Пополнение' : 'Снятие'

    if (Object.keys(amount).length === 0 || amount == undefined) {    // check for empty json passed
        res.render('users/gui/user-wallet', {
            mainTitle: 'Неверный запрос',
            code: 400,
            message: `Нет данных для обновления`,
            url: req.originalUrl,
        })
    } else if (!amount) {
        res.status(400).json({ error: 'Нет суммы' })
    } else if (!cardUsed) {
        res.status(400).json({ error: 'Нет карты' })
    } else if (!status || !remark) {
        res.status(400).json({ error: 'Произошла ошибка. Повторите' })
    }

    // checking for user wallet updates
    usersCardData.getCardByIds(email, cardUsed).then((cardInfo) => {

        let cardData = {
            name: cardInfo.name,
            number: cardInfo._id,
            type: cardInfo.type,
            expiry: cardInfo.expiry,
            cvv: cardInfo.cvv,
        }

        usersWalletData.addCash(email, JSON.parse(amount)).then((walletInfo) => {
            if (walletInfo == false) {
                if (amount < 0) {
                    res.json({ success: false, error: 'Баланс не может быть отрицательным' })
                } else {
                    res.json({ success: false, error: 'Максимальный баланс 100 000 рублей' })
                }
            } else if (walletInfo) {
                walletTransaction.logTransaction(email, amount, cardData, status, remark).then((transactions) => {
                    // logging transaction
                    req.user.wallet = walletInfo.wallet
                    let transactionsList = transactions.reverse()

                    let data = {
                        amount: walletInfo.wallet,
                        success: true,
                        transactions: transactionsList,
                    }

                    res.json(data)
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
            })
        })
})

//------------------------ route to quickly update wallet amount by user id with payment gatewaty
router.post('/', isLoggedIn, (req, res) => {

    let email = xss(req.user._id)
    let amount = xss(req.body.amount)
    let cardData = {
        name: xss(req.body.cardName),
        number: xss(req.body.cardNumber),
        type: xss(req.body.cardType),
        expiry: `${xss(req.body.cardMonth)}/${xss(req.body.cardYear)}`,
        cvv: xss(req.body.cardCVV),
    }
    let status = 'Кредитная'
    let remark = 'Пополнение'

    if (Object.keys(amount).length === 0 || amount == undefined) {    // check for empty json passed
        res.status(400).json({ error: 'Нет информации о кошельке' })
    } else if (!amount) {
        res.status(400).json({ error: 'Нет суммы' })
    } else if (!cardData.name) {
        res.status(400).json({ error: 'Нет кардхолдера' })
    } else if (!cardData.number) {
        res.status(400).json({ error: 'Нет номера карты' })
    } else if (!cardData.type) {
        res.status(400).json({ error: 'Нет типа карты' })
    } else if (!cardData.expiry) {
        res.status(400).json({ error: 'Нет срока карты' })
    } else if (!cardData.cvv) {
        res.status(400).json({ error: 'Нет CVV' })
    }

    // checking for user wallet updates
    usersWalletData.addCash(email, JSON.parse(amount)).then((walletInfo) => {

        if (walletInfo == false) {
            if (amount < 0) {
                res.render('alerts/error', {
                    mainTitle: 'Неверный запрос',
                    code: 400,
                    message: 'Баланс не может быть отрицательным',
                    url: req.originalUrl,
                    user: req.user,
                })
            } else {
                res.render('alerts/error', {
                    mainTitle: 'Неверный запрос',
                    code: 400,
                    message: 'Максимальный размер кошелька 100 000 рублей',
                    url: req.originalUrl,
                    user: req.user,
                })
            }
        } else if (walletInfo) {
            walletTransaction.logTransaction(email, amount, cardData, status, remark).then((transactions) => {		// logging transaction

                req.user.wallet = walletInfo.wallet
                let transactionsList = transactions.reverse()
                let transId = transactionsList[ 0 ]._id

                res.render('payment/payment-confirmation', {
                    mainTitle: 'Оплата успешна',
                    user: req.user,
                    redirectURL: '/user/dashboard/wallet',
                    amount: amount,
                    transactionId: transId,
                })
            })
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

// exporting routing apis
module.exports = router

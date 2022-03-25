/*
 * Users Routers *
 * Users GUI *
 * Users Wallet *
 * Users Routers for GUI/Dashboard actions *

 * Functionalities Index:
        =============================================================================================================
        | S.No. |  Type  |           URL          |   Function Call   | Controller |          Description           |
        =============================================================================================================
        |   1.  | Get    | /user/dashboard/wallet | updateUser        | users      | update user wallet info        |
        -------------------------------------------------------------------------------------------------------------
        |   2.  | Post   | /user/dashboard/wallet | ***               | ***        | Rendering payment gateway page |
        -------------------------------------------------------------------------------------------------------------
*/

/* importing required files and packages */
const express = require('express')
const router = express.Router()
const popup = require('window-popup').windowPopup
const xss = require('xss')
const data = require('../../../data')
const usersData = data.users
const walletTransaction = data.transactionWallet
const passport = require('../../../config/passport-users')

/* local scoped functions */

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
    walletTransaction.getTransactionByUserId(req.user._id).then((transactions) => {
        let transactionsList = transactions.reverse().slice(0, 10)

        res.render('users/gui/user-wallet', {
            mainTitle: 'Кошелек',
            user: req.user,
            transactions: transactionsList,
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

//------------------------ route to update wallet amount by user id through payment gatewaty
router.post('/', isLoggedIn, (req, res) => {

    let email = xss(req.user._id)
    let amount = xss(req.body.amount)

    if (Object.keys(amount).length === 0 || amount == undefined) {    // check for empty json passed
        res.render('users/gui/user-wallet', {
            mainTitle: 'Неверный запрос',
            code: 400,
            message: `Нет данных для обновления`,
            url: req.originalUrl,
            user: req.user,
        })
    } else if (!amount) {
        res.status(400).json({ error: 'Нет суммы' })
    }

    let discountAmt = 0,
        taxesAmt = 0,
        netAmt = amount - discountAmt + taxesAmt

    res.render('payment/add-cash-payment-gateway', {
        mainTitle: 'Оплата',
        user: req.user,
        amount: amount,
        discount: discountAmt,
        taxes: taxesAmt,
        net: netAmt,
    })
})

// exporting routing apis
module.exports = router

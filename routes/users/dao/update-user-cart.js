

const express = require('express')
const router = express.Router()
const xss = require('xss')
const data = require('../../../data')
const usersData = data.users
const usersCartData = data.usersCart
const productData = data.products
const passport = require('../../../config/passport-users')

/* local scoped function */

//------ user authentication validation
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    } else {
        res.render('users/auth/user-login-account', {
            mainTitle: 'Авторизация',
            url: `/product/id/${xss(req.params.id)}`,
        })
    }
}

/* global scoped function */
//------------------------ route to update user cart item
router.post('/:id/:loc', isLoggedIn, (req, res) => {

    let prodId = xss(req.params.id)
    let redirectLoc = xss(req.params.loc)
    let email = xss(req.user._id)

    if (!prodId) {
        res.status(400).json({ error: 'Продукт не выбран' })
    }

    productData.getProductById(prodId).then((prodInfo) => {

        if (prodInfo != null) {
            usersCartData.addItemInCart(email, prodInfo).then((cartLen) => {
                req.user.cartLen = cartLen

                if (redirectLoc === 'home') {
                    res.redirect('/')
                }

                if (redirectLoc === 'product-view') {
                    res.render('product/product-added-cart', {
                        mainTitle: 'Добавлено',
                        user: req.user,
                    })
                }
            })
        } else {
            res.render('alerts/error', {
                mainTitle: 'Неверный запрос',
                code: 400,
                message: 'Такого товара нет',
                url: req.originalUrl,
                user: req.user,
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

//------------------------ route to update cart quantity
router.put('/', isLoggedIn, (req, res) => {

    let email = xss(req.user._id)
    let prodId = xss(req.body.id)
    let quantity = parseInt(xss(req.body.qty))

    if (quantity < 1 && quantity > 5) {
        res.json({ success: false })
    }

    usersCartData.getProductById(email, prodId).then((isProduct) => {
        if (isProduct != null) {
            usersCartData.updateItemQty(email, prodId, quantity).then((userInfo) => {

                req.user = userInfo
                req.user.cartLen = userInfo.cartLen
                res.json({ success: true })

            })
        } else {
            res.render('alerts/error', {
                mainTitle: 'Неверный запрос',
                code: 400,
                message: 'Неправильный ID продукта',
                url: req.originalUrl,
                user: req.user,
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

//------------------------ route to delete user cart item
router.delete('/', isLoggedIn, (req, res) => {

    let prodId = xss(req.body.id)
    let email = xss(req.user._id)

    usersData.getUserById(email).then((userDetails) => {

        let isItemExists = false
        if (userDetails != null) {
            for (let i = 0; i < userDetails.cart.length; i++) {
                if (userDetails.cart[ i ]._id === prodId) {

                    isItemExists = true
                    usersCartData.deleteItemFromCart(email, prodId, userDetails.cart[ i ].qty).then((userInfo) => {

                        req.user = userInfo
                        req.user.cartLen = userInfo.cartLen
                        res.json({ success: true, cartSize: userInfo.cartLen })
                    })
                    break
                }
            }

            if (isItemExists == false) {
                res.render('alerts/error', {
                    mainTitle: 'Неверный запрос',
                    code: 400,
                    message: 'Неправильный ID продукта',
                    url: req.originalUrl,
                    user: req.user,
                })
            }

        } else {
            res.render('alerts/error', {
                mainTitle: 'Неверный запрос',
                code: 400,
                message: 'Нет пользователя',
                url: req.originalUrl,
                user: req.user,
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

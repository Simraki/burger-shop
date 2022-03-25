

const express = require('express')
const router = express.Router()
const xss = require('xss')
const data = require('../../data')
const productsData = data.products


//------------------------ route to get product information by id
router.get('/id/:id', (req, res) => {
    productsData.getProductById(req.params.id).then((productInfo) => {

        if (productInfo != null) {
            res.send(productInfo)


        } else {
            res.render('alerts/error', {
                mainTitle: 'Не найдено',
                code: 404,
                message: 'Не найдено',
                url: req.originalUrl,
                user: req.user,
            })
        }
    })
        .catch((error) => {
            res.render('alerts/error', {
                mainTitle: 'Не найдено',
                code: 404,
                message: 'Не найдено',
                url: req.originalUrl,
                user: req.user,
            })
        })
})

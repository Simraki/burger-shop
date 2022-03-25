


const express = require('express')
const router = express.Router()
const xss = require('xss')
const data = require('../../data')
const productsData = data.products


//------------------------ route to get all product list
router.get('/', (req, res) => {
    productsData.getAllProducts().then((productsList) => {
        res.send(productsList)
    })
        .catch((error) => {
            res.send({ error: error })
        })
})

//------------------------ route to get product information by id
router.get('/id/:id', (req, res) => {
    productsData.getProductById(xss(req.params.id)).then((productInfo) => {

        if (productInfo != null) {
            res.render('product/product-info', {
                mainTitle: `${productInfo.title}`,
                user: req.user,
                product: productInfo,
            })
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

//------------------------ route to get product information by id
router.get('/category/:category', (req, res) => {
    productsData.getProductByCategory(xss(req.params.category)).then((productsList) => {

        if (productsList != null) {
            let title = 'Поиск по категории'
            switch (productsList[ 0 ].category) {
                case 'burger':
                    title = 'Бургеры'
                    break
                case 'snack':
                    title = 'Закуски'
                    break
                case 'drink':
                    title = 'Напитки'
                    break
            }

            res.render('product/product-category-results', {
                mainTitle: xss(title),
                user: req.user,
                product: productsList,
                category: xss(req.params.category),
            })
        } else {
            res.render('alerts/error', {
                mainTitle: 'Не найдено',
                code: 404,
                message: `Ничего не найдено`,
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

//------------------------ route to get product information by search command
router.get('/search', (req, res) => {
    let prodSearchbar = xss(req.query.keyword)

    if (prodSearchbar) {
        productsData.getProductBySearch(prodSearchbar).then((productResults) => {

            if (productResults.length != 0) {
                res.render('product/product-search-results', {
                    mainTitle: `${prodSearchbar}`,
                    product: productResults,
                    searchedOf: prodSearchbar,
                    user: req.user,
                })
            } else {
                res.render('alerts/error', {
                    mainTitle: 'Не найдено',
                    code: 404,
                    message: 'Ничего не найдено',
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
    } else {
        res.redirect('/')
    }
})

router.post('/search/filter', (req, res) => {

    let search = xss(req.body.search)
    let category = xss(req.body.category)
    let startRange = parseFloat(xss(req.body.startRange))
    let endRange = parseFloat(xss(req.body.endRange))

    if (isNaN(startRange)) {
        startRange = undefined
    }
    if (isNaN(endRange)) {
        endRange = undefined
    }

    productsData.getProductBySearch(search, startRange, endRange, category).then((filteredProducts) => {

        if (filteredProducts.length > 0) {
            res.json({
                empty: false,
                product: filteredProducts,
            })
        } else {
            res.json({ empty: true })
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

router.post('/filter', (req, res) => {

    let category = xss(req.body.category)
    let startRange = parseFloat(xss(req.body.startRange))
    let endRange = parseFloat(xss(req.body.endRange))

    console.log('fil2')

    if (isNaN(startRange)) {
        startRange = undefined
    }
    if (isNaN(endRange)) {
        endRange = undefined
    }

    productsData.getProductByFilter(category, startRange, endRange).then((filteredProducts) => {

        if (filteredProducts.length > 0) {
            res.json({
                empty: false,
                product: filteredProducts,
            })
        } else {
            res.json({ empty: true })
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

//------------------------ route to add product information
router.post('/', (req, res) => {

    let productUpdates = req.body

    if (Object.keys(productUpdates).length === 0 || productUpdates == undefined) {    // check for empty json passed
        res.status(400).json({ error: 'Нет данных' })
    } else if (!productUpdates.title) {
        res.status(400).json({ error: 'Нет заголовка' })
    } else if (!productUpdates.description) {
        res.status(400).json({ error: 'Нет описани' })
    } else if (!productUpdates.category) {
        res.status(400).json({ error: 'Нет категории' })
    } else if (!productUpdates.weight) {
        res.status(400).json({ error: 'Не указан вес' })
    } else if (!productUpdates.price) {
        res.status(400).json({ error: 'Не указана цена' })
    } else if (!productUpdates.images) {
        productUpdates[ 'images' ] = []
    }

    productsData.addNewProduct(productUpdates.title, productUpdates.description, productUpdates.category, productUpdates.weight, productUpdates.price, productUpdates.images)
        .then(() => {
            res.send({ success: true })
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

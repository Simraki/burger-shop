


const uuid = require('uuid')
const xss = require('xss')
const products = require('../config/mongodb-collection').products


module.exports = productsControllers = {


    getProductById: (id) => {
        return products().then((productsCollection) => {
            return productsCollection.findOne({ _id: id })
        })
            .catch(() => {
                return Promise.reject('Server issue with \'products\' collection.')
            })
    },


    getProductByCategory: (category) => {
        return products().then((productsCollection) => {
            return productsCollection.find({ category: { $regex: `.*${category}.*`, $options: 'i' } }).toArray()
        })
            .catch(() => {
                return Promise.reject('Server issue with \'products\' collection.')
            })
    },

    //------------------------ fetch a product information by search string
    getProductBySearch: (keyword, startRange, endRange, category) => {
        return products().then((productsCollection) => {  // returning a found json document else returning null

            let args = {}
            if (keyword) {
                let query = [
                    { _id: keyword },
                    { title: { $regex: `.*${keyword}.*`, $options: 'i' } },
                    { category: { $regex: `.*${keyword}.*`, $options: 'i' } },
                    { description: { $regex: `.*${keyword}.*`, $options: 'i' } },
                ]
                args = {...args, $or: query}
            }
            if (startRange !== undefined || endRange !== undefined) {
                args = {
                    ...args,
                    price: {
                        ...(startRange !== undefined && {
                            $gte: startRange,
                        }),
                        ...(endRange !== undefined && {
                            $lte: endRange,
                        }),
                    }
                }
            }
            if (category) {
                args = {
                    ...args,
                    category: { $regex: `.*${category}.*`, $options: 'i' }
                }
            }
            console.log(args)

            return productsCollection.find(args, {
                _id: 1,
                title: 1,
                category: 1,
                price: 1,
                images: 1,
            }).toArray()
        })
            .catch(() => {  // returning a reject promise
                return Promise.reject('Server issue with \'products\' collection.')
            })
    },

    //------------------------ fetch a product information by filter string
    getProductByFilter: (category, startRange, endRange) => {
        return products().then((productsCollection) => {
            const hopper = {
                price: {
                    ...(startRange !== undefined && {
                        $gte: startRange,
                    }),
                    ...(endRange !== undefined && {
                        $lte: endRange,
                    }),
                },
            }

            return productsCollection.find({
                category: { $regex: `.*${category}.*`, $options: 'i' },
                ...(Object.keys(hopper.price).length !== 0 && hopper),
            }, { _id: 1, title: 1, category: 1, price: 1, images: 1 }).toArray()
        })
            .catch(() => {  // returning a reject promise
                return Promise.reject('Server issue with \'products\' collection.')
            })
    },
//
    //------------------------ fetch all product information
    getAllProducts: () => {
        return products().then((productsCollection) => {  // returning a found json document else returning null
            return productsCollection.find({}).toArray()
        })
            .catch(() => {  // returning a reject promise
                return Promise.reject('Server issue with \'products\' collection.')
            })
    },

    //------------------------ insert/create a new product record
    addNewProduct(title, description, category, weight, price, images) {
        return products().then((productsCollection) => {

            // new product object
            let newProduct = {
                _id: uuid.v4(),
                title: xss(title),
                description: xss(description),
                category: xss(category),
                weight: parseFloat(xss(weight)),
                price: parseFloat(xss(price)),
                images: images,
            }

            // adding a record in to the collection
            return productsCollection.insertOne(newProduct)
                .then((newProductInformation) => {
                    return newProductInformation.insertedId
                })
        })
            .catch(() => {  // returning a reject promise
                return Promise.reject('Server issue with \'products\' collection.')
            })
    },
}

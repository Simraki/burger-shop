


const xss = require('xss')
const mongoDbCollection = require('../config/mongodb-collection')
const users = mongoDbCollection.users

module.exports = cartControllers = {


    getProductById: (email, prod) => {
        return users().then((usersCollection) => {
            return usersCollection.findOne({ _id: email, 'cart._id': prod })
        })
    },


    getAllCartItems: (email) => {
        return users().then((usersCollection) => {
            return usersCollection.findOne({ _id: email }, { _id: 0, cart: 1 })
        })
            .catch(() => {
                return Promise.reject('Server issue with \'users cart\' collection.')
            })
    },


    addItemInCart: (email, prodInfo) => {
        return users().then((usersCollection) => {
            return usersCollection.findOne({ _id: email }).then((userInfo) => {


                let userChanges = {
                    cartLen: userInfo.cartLen,
                }

                let exist = false
                let quant = 1
                for (let i = 0; i < userInfo.cart.length; i++) {
                    if (userInfo.cart[ i ]._id === prodInfo._id) {
                        exist = true
                        quant = quant + userInfo.cart[ i ].qty
                        break
                    }
                }

                if (!exist) {

                    let addItem = {
                        _id: prodInfo._id,
                        title: prodInfo.title,
                        description: prodInfo.description,
                        weight: prodInfo.weight,
                        price: prodInfo.price,
                        image: prodInfo.images[ 0 ],
                        qty: quant,
                        total: prodInfo.price * quant,
                    }

                    userChanges[ 'cartLen' ] = userChanges.cartLen + 1


                    usersCollection.updateOne({ _id: email }, { $push: { cart: addItem } })
                    usersCollection.updateOne({ _id: email }, { $set: userChanges })
                } else {
                    usersCollection.updateOne({ 'cart._id': prodInfo._id }, {
                        $set: {
                            cartLen: userChanges.cartLen + 1,
                            'cart.$.qty': quant,
                            'cart.$.total': Math.round(prodInfo.price * quant * 100) / 100,
                        },
                    })
                    userChanges[ 'cartLen' ] = userChanges.cartLen + 1
                }

                return userChanges.cartLen
            })
        })
            .catch(() => {
                return Promise.reject('Server issue with \'users cart\' collection.')
            })
    },


    updateItemQty: (email, itemId, itemQty) => {
        return users().then((usersCollection) => {
            return usersCollection.findOne({ _id: email }).then((userInfo) => {

                if (userInfo != null) {

                    let cartLen = userInfo.cartLen
                    let itemCost = 0

                    for (let i = 0; i < userInfo.cart.length; i++) {
                        if (userInfo.cart[ i ]._id === itemId) {
                            itemCost = userInfo.cart[ i ].price
                            cartLen = cartLen - userInfo.cart[ i ].qty + itemQty
                            break
                        }
                    }

                    usersCollection.updateOne({ _id: email, 'cart._id': itemId }, {
                        $set: {
                            cartLen: cartLen,
                            'cart.$.qty': itemQty,
                            'cart.$.total': Math.round(itemCost * itemQty * 100) / 100,
                        },
                    })
                    return usersCollection.findOne({ _id: email })
                }

                res.json({ error: 'user not exist' })
            })
        })
            .catch(() => {
                return Promise.reject('Server issue with \'users cart\' collection.')
            })
    },


    deleteItemFromCart: (email, itemId, itemQtyToDelete) => {
        return users().then((usersCollection) => {
            return usersCollection.updateOne({ _id: email }, { $pull: { cart: { _id: itemId } } }).then((deletedCartInfo) => {

                if (deletedCartInfo.deletedCount === 0) {
                    return 'not deleted'
                } else {
                    return usersCollection.findOne({ _id: email }).then((userInfo) => {


                        let userChanges = {
                            cartLen: userInfo.cartLen - itemQtyToDelete,
                        }


                        usersCollection.updateOne({ _id: email }, { $set: userChanges })
                        return usersCollection.findOne({ _id: email })
                    })
                }
            })
        })
            .catch(() => {  // returning a reject promise
                return Promise.reject('Server issue with \'users cart\' collection.')
            })
    },

    emptyCart: (email) => {
        return users().then((usersCollection) => {
            return usersCollection.findOne({ _id: email }).then((userInfo) => {

                if (userInfo != null) {

                    usersCollection.updateOne({ _id: email }, { $set: { cart: [], cartLen: 0 } })
                    return usersCollection.findOne({ _id: email })
                }

                res.json({ error: 'user not exist' })
            })
        })
            .catch(() => {  // returning a reject promise
                return Promise.reject('Server issue with \'users cart\' collection.')
            })
    },
}

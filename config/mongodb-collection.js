const connectDb = require('./mongodb-connection')

let getCollection = (collection) => {
    let _col = undefined

    return async () => {
        if (!_col) {
            const db = await connectDb()
            return db.collection(collection)
        }

        return _col
    }
}

module.exports = {
    contacts: getCollection('contacts'),
    credentials: getCollection('credentials'),
    products: getCollection('products'),
    subscriptions: getCollection('subscriptions'),
    transactionOrder: getCollection('orderTransaction'),
    transactionWallet: getCollection('walletTransaction'),
    users: getCollection('users'),
}

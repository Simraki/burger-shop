


const uuid = require('uuid')
const mongoDbCollection = require('../config/mongodb-collection')
const walletTransaction = mongoDbCollection.transactionWallet


module.exports = walletTransactionsControllers = {

    //------------------------ fetch a wallet transaction information by transaction id
    getTransactionById: (id) => {
        return walletTransaction().then((walletTransactionCollection) => {  // returning a found json document else returning null
            return walletTransactionCollection.findOne({ _id: id }, {
                _id: 1,
                user: 1,
                amount: 1,
                date: 1,
                status: 1,
                remark: 1,
            })
        })
            .catch(() => {  // returning a reject promise
                return Promise.reject('Server issue with \'wallet transaction\' collection.')
            })
    },

    //------------------------ fetch all wallet transaction information by user email
    getTransactionByUserId: (email) => {
        return walletTransaction().then((walletTransactionCollection) => {  // returning a found json document else returning null
            return walletTransactionCollection.find({ user: email }).toArray()
        })
            .catch(() => {  // returning a reject promise
                return Promise.reject('Server issue with \'wallet transaction\' collection.')
            })
    },

    //------------------------ insert/create a new user record
    logTransaction: (email, amount, cardData, status, remark) => {
        return walletTransaction().then((walletTransactionCollection) => {

            let topUpCheck = false
            if (status === 'Пополнение') {
                topUpCheck = true
            }

            // new user object
            let newLog = {
                _id: uuid.v4(),
                user: email,
                amount: amount,
                cardDetails: cardData,
                date: new Date().toLocaleString('ru'),
                status: status,
                isTopUp: topUpCheck,
                remark: remark,
            }

            // adding a record in to the collection
            return walletTransactionCollection.insertOne(newLog)
                .then((newLogInformation) => {
                    return newLogInformation.insertedId
                })
                .then((newLogId) => {  // returning created user document
                    return walletTransactionsControllers.getTransactionByUserId(email)
                })
        })
            .catch(() => {  // returning a reject promise
                return Promise.reject('Server issue with \'wallet transaction\' collection.')
            })
    },
}

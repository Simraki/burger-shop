


const uuid = require('uuid')
const mongoDbCollection = require('../config/mongodb-collection')
const orderTransaction = mongoDbCollection.transactionOrder


module.exports = orderTransactionsControllers = {


    getTransactionById: (id) => {
        return orderTransaction().then((orderTransactionCollection) => {  // returning a found json document else returning null
            return orderTransactionCollection.findOne({ _id: id })
        })
            .catch(() => {  // returning a reject promise
                return Promise.reject('Server issue with \'order transaction\' collection.')
            })
    },

    //------------------------ fetch all order transaction information by user email
    getTransactionByUserId: (email) => {
        return orderTransaction().then((orderTransactionCollection) => {  // returning a found json document else returning null
            return orderTransactionCollection.find({ user: email }).toArray()
        })
            .catch(() => {  // returning a reject promise
                return Promise.reject('Server issue with \'orders transaction\' collection.')
            })
    },

    //------------------------ insert/create a new transaction record
    logTransaction: (email, amount, cardData, cartItems, mode) => {
        return orderTransaction().then((orderTransactionCollection) => {

            // new user object
            let newLog = {
                _id: uuid.v4(),
                user: email,
                amount: amount,
                card: cardData,
                items: cartItems,
                payMode: mode,
                date: new Date().toLocaleString('ru'),
            }

            // adding a record in to the collection
            return orderTransactionCollection.insertOne(newLog)
                .then((newLogInformation) => {
                    return newLogInformation.insertedId
                })
        })
            .catch(() => {  // returning a reject promise
                return Promise.reject('Server issue with \'order transaction\' collection.')
            })
    },
}

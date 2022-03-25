


const xss = require('xss')
const mongoDbCollection = require('../config/mongodb-collection')
const users = mongoDbCollection.users

module.exports = walletControllers = {


    getCashById: (email) => {
        return users().then((usersCollection) => {
            return usersCollection.findOne({ _id: email }, { _id: 0, wallet: 1 })
        })
            .catch(() => {
                return Promise.reject('Server issue with \'users wallet\' collection.')
            })
    },


    addCash: (email, newCash) => {
        return users().then((usersCollection) => {
            return walletControllers.getCashById(email).then((walletInfo) => {

                let userChanges = {}
                let availableCash = walletInfo.wallet
                let totalWalletCash = 0


                if (newCash) {
                    totalWalletCash = Math.round(newCash * 100 + availableCash * 100) / 100
                    if (totalWalletCash < 0) {
                        return false
                    }
                }

                if (totalWalletCash < 100000) {

                    userChanges[ 'wallet' ] = totalWalletCash
                    return usersCollection.updateOne({ _id: email }, { $set: userChanges }).then(() => {
                        return walletControllers.getCashById(email)
                    })
                } else {
                    return false
                }
            })
        })
            .catch(() => {
                return Promise.reject('Server issue with \'users wallet\' collection.')
            })
    },


    deductCash: (email, spendCash) => {
        return users().then((usersCollection) => {
            return walletControllers.getCashById(email).then((walletInfo) => {

                let userChanges = {}
                let availableCash = walletInfo.wallet


                if (spendCash) {
                    userChanges[ 'wallet' ] = Math.round(availableCash * 100 - spendCash * 100) / 100
                }


                return usersCollection.updateOne({ _id: email }, { $set: userChanges }).then(() => {
                    return walletControllers.getCashById(email)
                })
            })
        })
            .catch(() => {
                return Promise.reject('Server issue with \'users wallet\' collection.')
            })
    },
}




const mongoDbCollection = require('../config/mongodb-collection')
const subscriptions = mongoDbCollection.subscriptions


module.exports = subscriptionsControllers = {


    getSubscriptionById: (email) => {
        return subscriptions().then((subscriptionsCollection) => {

            return subscriptionsCollection.findOne({ _id: email }, { _id: 1, activeStatus: 1 })
                .then((subscriptionInfo) => {
                    return subscriptionInfo
                }, () => {
                    return null
                })
        })
            .catch(() => {

                return Promise.reject('Server issue with \'subscriptions\' collection.')
            })
    },


    addSubscription: (email) => {
        return subscriptions().then((subscriptionsCollection) => {

            let newSubscription = {
                _id: email,
                subscribedDate: new Date().toLocaleString('ru'),
                activeStatus: true,
            }


            return subscriptionsCollection.insertOne(newSubscription)
        })
            .catch(() => {

                return Promise.reject('Server issue with \'subscriptions\' collection.')
            })
    },


    updateSubscription: (email) => {
        return subscriptions().then((subscriptionsCollection) => {


            let subscriptionChanges = {}

            subscriptionChanges[ 'subscribedDate' ] = new Date().toLocaleString('ru')
            subscriptionChanges[ 'activeStatus' ] = true


            return subscriptionsCollection.updateOne({ _id: email }, { $set: subscriptionChanges })
                .then(() => {
                    return true
                }, () => {
                    return false
                })
        })
            .catch(() => {

                return Promise.reject('Server issue with \'subscriptions\' collection.')
            })
    },


    removeSubscription: (email) => {
        return subscriptions().then((subscriptionsCollection) => {

            // update subscription object (empty)
            let subscriptionChanges = {}
            subscriptionChanges[ 'activeStatus' ] = false

            // updating user information into the collection
            return subscriptionsCollection.updateOne({ _id: email }, { $set: subscriptionChanges })
                .then(() => {
                    return true
                }, () => {
                    return false
                })
        })
            .catch(() => {
                // returning a reject promise
                return Promise.reject('Server issue with \'subscriptions\' collection.')
            })
    },
}

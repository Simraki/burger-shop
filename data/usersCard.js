


const xss = require('xss')
const mongoDbCollection = require('../config/mongodb-collection')
const users = mongoDbCollection.users

module.exports = cardControllers = {


    getCardById: (id) => {
        return users().then((usersCollection) => {
            return usersCollection.findOne({ _id: email, 'card._id': id }, {
                'card._id': 1,
                'card.name': 1,
                'card.type': 1,
                'card.expiry': 1,
                'card.cvv': 1,
            })
        })
            .catch(() => {
                return Promise.reject('Server issue with \'users card\' collection.')
            })
    },


    getCardByIds: (email, id) => {
        return users().then((usersCollection) => {
            return usersCollection.findOne({ _id: email, 'card._id': id }, { _id: 0, card: 1 }).then((cardList) => {

                cardList = cardList.card

                if (!cardList) {
                    return Promise.reject('No card is saved')
                }


                let loc = 0
                while (loc < cardList.length) {
                    if (cardList[ loc ]._id === id.toString()) {
                        break
                    }

                    loc++
                }


                let cardDetails = {
                    _id: id,
                    name: cardList[ loc ].name,
                    type: cardList[ loc ].type,
                    expiry: cardList[ loc ].expiry,
                    cvv: cardList[ loc ].cvv,
                }

                return cardDetails
            })
        })
            .catch(() => {
                return Promise.reject('Server issue with \'users card\' collection.')
            })
    },


    getAllCard: (email) => {
        return users().then((usersCollection) => {
            return usersCollection.findOne({ _id: email }, { _id: 0, card: 1 })
        })
            .catch(() => {
                return Promise.reject('Server issue with \'users card\' collection.')
            })
    },


    addCard: (email, newCardData) => {
        users().then((usersCollection) => {
            usersCollection.findOne({ _id: email }).then(() => {


                let addCard = {}


                if (newCardData.number) {
                    addCard[ '_id' ] = xss(newCardData.number)
                }

                if (newCardData.username) {
                    addCard[ 'name' ] = xss(newCardData.username)
                }

                if (newCardData.type) {
                    addCard[ 'type' ] = xss(newCardData.type)
                }

                if (newCardData.exp) {
                    addCard[ 'expiry' ] = xss(newCardData.exp)
                }

                if (newCardData.cvv) {
                    addCard[ 'cvv' ] = xss(newCardData.cvv)
                }


                usersCollection.updateOne({ _id: email }, { $push: { card: addCard } })
            })
        })
            .catch(() => {  // returning a reject promise
                return Promise.reject('Server issue with \'users card\' collection.')
            })
    },

    //------------------------ delete a card information
    deleteCard: (email, cardId) => {
        return users().then((usersCollection) => {
            return usersCollection.updateOne({ _id: email }, { $pull: { card: { _id: cardId } } }).then((deletedCardInfo) => {
                if (deletedCardInfo.deletedCount === 0) {
                    return 'deleted'
                }
            })
        })
            .catch(() => {  // returning a reject promise
                return Promise.reject('Server issue with \'users card\' collection.')
            })
    },
}

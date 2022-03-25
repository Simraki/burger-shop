


const mongoDbCollection = require('../config/mongodb-collection')
const users = mongoDbCollection.users


function makeAlias(name) {
    let alias = name.split(' ', 1)[0]
    if (alias.length > 12) {
        alias = alias.slice(0, 9) + '...'
    }
    return alias
}


module.exports = usersControllers = {


    getUserById: (email) => {
        return users().then((usersCollection) => {
            return usersCollection.findOne({ _id: email }, {
                _id: 1,
                name: 1,
                alias: 1,
                mobile: 1,
                cart: 1,
                cartLen: 1,
                card: 1,
                wallet: 1,
            })
        })
            .catch(() => {
                return Promise.reject('Server issue with \'users\' collection.')
            })
    },


    createNewUser: (name, email, mobile) => {
        return users().then((usersCollection) => {

            let alias = makeAlias(name)


            let newUser = {
                _id: email,
                name: name,
                alias: alias,
                mobile: mobile,
                regDate: new Date().toLocaleString('ru'),
                cart: [],
                cartLen: 0,
                card: [],
                wallet: 0,
            }


            return usersCollection.insertOne(newUser)
                .then((newUserInformation) => {
                    return newUserInformation.insertedId
                })
                .then((newUserId) => {
                    return usersControllers.getUserById(newUserId)
                })
        })
            .catch(() => {
                return Promise.reject('Server issue with \'users\' collection.')
            })
    },


    updateProfile: (email, name, mobile) => {
        return users().then((usersCollection) => {

            let userChanges = {}


            if (name) {
                userChanges[ 'name' ] = name
                userChanges[ 'alias' ] = makeAlias(name)
            }

            if (mobile) {
                userChanges[ 'mobile' ] = mobile
            }


            return usersCollection.updateOne({ _id: email }, { $set: userChanges }).then(() => {
                return usersControllers.getUserById(email)
            })
        })
            .catch(() => {
                return Promise.reject('Server issue with \'users\' collection.')
            })
    },


    updateWallet: (email, newCash, availableCash) => {
        return users().then((usersCollection) => {

            let userChanges = {}

            console.log(newCash)

            // checking for values to update
            if (newCash) {
                userChanges[ 'wallet' ] = newCash + availableCash
                if (userChanges[ 'wallet' ] < 0) {
                    throw new Error('Отрицательный баланс')
                }
            }

            // updating user information into the collection
            return usersCollection.updateOne({ _id: email }, { $set: userChanges }).then(() => {
                return usersControllers.getUserById(email)
            })
        })
            .catch(() => {  // returning a reject promise
                return Promise.reject('Server issue with \'users\' collection.')
            })
    },

    //------------------------ delete a user record of specific id from users collection
    deleteUser: (email) => {
        return users().then((usersCollection) => {
            return usersCollection.removeOne({ _id: email })
                .then((deletedUserInformation) => {
                    if (deletedUserInformation.deletedCount === 0) {
                        return Promise.reject(`No result having id ${email} from users collection`)
                    }
                })
        })
            .catch(() => {  // returning a reject promise
                return Promise.reject('Server issue with \'users\' collection.')
            })
    },
}




const bcrypt = require('bcrypt')
const randomString = require('randomstring')
const mongoDbCollection = require('../config/mongodb-collection')
const credentials = mongoDbCollection.credentials




function generateHashedPassword(password) {
    return bcrypt.hashSync(password, 10)
}


module.exports = credentialsControllers = {


    getCredentialById: (email) => {
        return credentials().then((credentialsCollection) => {

            return credentialsCollection.findOne({ _id: email }, { _id: 1, password: 1 })
        })
            .catch(() => {

                return Promise.reject('Server issue with \'credentials\' collection.')
            })
    },


    compareCredential: (email, password) => {
        return credentials().then((credentialsCollection) => {

                return credentialsCollection.findOne({ _id: email }, { _id: 1, password: 1 })
                    .then((credentialInfo) => {


                        if (bcrypt.compareSync(password, credentialInfo.password)) {
                            return Promise.resolve('Password matched')
                        } else {
                            return Promise.reject('Incorrect Password')
                        }
                    })
            },
            () => {

                return Promise.reject('Server issue with \'credentials\' collection.')
            })
    },


    generateCredential: ((email) => {
        return credentials().then((credentialsCollection) => {

            let genPassword = randomString.generate(6)


            let credentialChanges = {}
            credentialChanges[ 'password' ] = generateHashedPassword(genPassword)


            credentialsCollection.updateOne({ _id: email }, { $set: credentialChanges })
            return genPassword
        })
            .catch(() => {

                return Promise.reject('Server issue with \'credentials\' collection.')
            })
    }),


    createNewCredential: (email, password) => {
        return credentials().then((credentialsCollection) => {


            let newCredential = {
                _id: email,
                password: generateHashedPassword(password),
            }


            return credentialsCollection.insertOne(newCredential)
                .then((newCredentialInformation) => {
                    return newCredentialInformation.insertedId
                })
                .then((newCredentialId) => {


                    return newCredentialId
                })
        })
            .catch(() => {

                return Promise.reject('Server issue with \'credentials\' collection.')
            })
    },


    updateCredential: (email, password, savedPassword) => {
        return credentials().then((credentialsCollection) => {

            // update credential object (empty)
            let credentialChanges = {}

            // checking for values to update
            if (password) {
                // checking for same passwords
                if (bcrypt.compareSync(password, savedPassword)) {
                    console.log('Same Password')
                    return false
                } else {
                    // saving the password after hashing it
                    credentialChanges[ 'password' ] = generateHashedPassword(password)

                    // updating credential information into the collection
                    credentialsCollection.updateOne({ _id: email }, { $set: credentialChanges })
                    console.log('Password Updated')
                    return true
                }
            }
        })
            .catch(() => {
                // returning a reject promise
                return Promise.reject('Server issue with \'credentials\' collection.')
            })
    },

    //------------------------ delete a credential record of specific email id
    deleteCredential: (email) => {
        return credentials().then((credentialsCollection) => {
            // deleting a record
            return credentialsCollection.removeOne({ _id: email })
                .then((deletedCredentialInformation) => {
                    if (deletedCredentialInformation.deletedCount === 0) {
                        // returning a reject promise
                        return Promise.reject(`No result having email id '${email}' from credentials collection`)
                    }
                })
        })
            .catch(() => {
                // returning a reject promise
                return Promise.reject('Server issue with \'credentials\' collection.')
            })
    },
}

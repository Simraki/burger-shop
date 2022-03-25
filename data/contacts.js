


const uuid = require('uuid')
const mongoDbCollection = require('../config/mongodb-collection')
const contacts = mongoDbCollection.contacts


module.exports = contactsControllers = {


    addContact: (name, email, mobile, description) => {
        return contacts().then((contactsCollection) => {


            let newContact = {
                _id: uuid.v4(),
                name: name,
                email: email,
                mobile: mobile,
                description: description,
                contactedDate: new Date().toLocaleString('ru'),
            }


            return contactsCollection.insertOne(newContact)
                .then(() => {
                    return true
                }, () => {
                    return false
                })
        })
            .catch(() => {

                return Promise.reject('Server issue with \'contacts\' collection.')
            })
    },
}

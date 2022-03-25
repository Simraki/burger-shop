const MongoClient = require('mongodb').MongoClient

const settings = {
    mongoConfig: {
        serverUrl: 'mongodb://admin89:admin8900@localhost:27017/',
        // serverUrl: 'mongodb://localhost:27017/',
        database: 'db-shop',
    },
}

let connectDb = async () => {
    const client = await MongoClient.connect(settings.mongoConfig.serverUrl)
    return client.db(settings.mongoConfig.database)
}

module.exports = connectDb

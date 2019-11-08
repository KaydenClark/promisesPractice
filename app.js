const MongoClient = require('mongodb').MongoClient;
const ObjectId = require("mongodb").ObjectId;
const assert = require('assert');
require('dotenv').config()

// Connection URL
const url = process.env.ATLAS_CONNECTION

// Database Name
const dbName = 'Network';
const settings = {
    useUnifiedTopology: true
}

const testConnection = async () => {
    let iou = new Promise((resolve, reject) => {
        // Use connect method to connect to the server
        MongoClient.connect(url, settings, function (err, client) {
            if (err) {
                assert.equal(null, err);
                reject(err)
            } else {
                console.log("Connected successfully to server");
                const db = client.db(dbName);
                client.close();
                resolve("Connected successfully to server")
            }
        });
    });
    return iou
}

const createContact = (contact) => {
    let iou = new Promise((resolve, reject) => {
        // Use connect method to connect to the server
        MongoClient.connect(url, settings, function (err, client) {
            if (err) {
                reject(err)
            } else {
                console.log("Connected to server for Creation of Contact");
                const db = client.db(dbName);
                // Get the contacts collection
                const collection = db.collection('Contacts');
                // Insert a document
                collection.insertOne(contact, function (err, result) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve("Inserted a document into the collection");
                        client.close();
                    }
                });

            }
        });
    })
    return iou
}

const readContacts = () => {
    let iou = new Promise((resolve, reject) => {
        // Use connect method to connect to the server
        MongoClient.connect(url, settings, function (err, client) {
            if (err) {
                reject(err)
            } else {
                console.log("Connected to server Read Contacts");
                const db = client.db(dbName);
                // Get the contacts collection
                const collection = db.collection('Contacts');
                // Find some documents
                collection.find({}).toArray(function (err, docs) {
                    if (err) {
                        reject(err)
                    } else {
                        const results = {
                            data: docs,
                            msg: "Found the following records"
                        }
                        client.close();
                        resolve(results);
                    }
                });
            }
        });
    })
    return iou
}

const updateContact = (id, contact) => {
    let iou = new Promise((resolve, reject) => {
        // Use connect method to connect to the server
        MongoClient.connect(url, settings, function (err, client) {
            if (err) {
                reject(err)
            } else {
                const db = client.db(dbName);
                // Get the contacts collection
                const collection = db.collection('Contacts');
                // Insert a document
                collection.updateOne({
                        '_id': ObjectId(id)
                    }, {
                        $set: {
                            ...contact
                        }
                    },
                    function (err, result) {
                        if (err) {
                            reject(err)
                        } else {
                            client.close();
                            resolve("Updated a document in the collection");
                        }
                    });
            }
        });
    })
    return iou
}

const deleteContact = (name) => {
    let iou = new Promise((resolve, reject) => {
        // Use connect method to connect to the server
        MongoClient.connect(url, settings, function (err, client) {
            if (err) {
                reject(err)
            } else {
                const db = client.db(dbName);
                // Get the contacts collection
                const collection = db.collection('Contacts');
                // Insert a document
                collection.deleteMany({
                        'Name': name
                    },
                    function (err, result) {
                        if (err) {
                            reject(err)
                        } else {
                            client.close();
                            resolve('deleted')
                        }
                    });
            }
        });
    })
    return iou
}

const newContact = {
    "Name": "George",
    "Email": "test@test.test",
    "Phone": "000-000-0000"
}
const changeContact = {
    "Name": "Wesley"
}
const updateID = '5dc090411c9d44000028443d'
const main = async () => {
    console.log(await testConnection())
    console.log('----------------------- Post test')
    console.log(await createContact(newContact))
    console.log('----------------------- Post Create')
    console.log(await readContacts())
    console.log('----------------------- Post Read')
    console.log(await updateContact(updateID, changeContact))
    console.log('----------------------- Post Update')
    console.log(await deleteContact('George'))
    console.log('----------------------- Post Delete')
    console.log(await readContacts())
    console.log('----------------------- Post Read')
}

main()
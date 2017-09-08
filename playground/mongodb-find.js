
//`const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unabloe to connect to MongoDB server');

    }
    //    console.log('Connected to MongoDB server');
    //
    //    db.collection('Todos').find({
    //        _id: new ObjectID('59b1462633d98209f72b64ba')
    //    }).toArray().then((docs) => {
    //        console.log('Todos');
    //        console.log(JSON.stringify(docs, undefined, 2));
    //    },(err) => {
    //    console.log('Unable to fetch todos', err);
    //    })

    //db.collection('Todos').find().count().then((count) => {
    //    console.log(`Todos count ${count}`);
    //},(err) => {
    //console.log('Unable to fetch todos', err);
    //})
    db.collection('Users').find({name: 'Daniel'}).toArray().then((docs) => {
        console.log(JSON.stringify(docs, undefined, 2));
    },(err) => {
    console.log('Unable to fetch users', err);
    })

    //db.close();
});



//`const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unabloe to connect to MongoDB server');
    }

    //    db.collection('Todos').findOneAndUpdate({
    //        _id: new ObjectID('59b28060c3db3acf615d0f1e')
    //    }, {
    //        $set: {
    //            completed: true
    //        }
    //        },{
    //        returnOriginal: false
    //    }).then((result) => {
    //        console.log(result);
    //    })
    db.collection('Users').findOneAndUpdate({
        name: 'Daniel'
    }, {
        $set: {
            name: 'kuku'
        },
        $inc: {
        age: 1
        }
        },{
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    })

    //db.close();
});


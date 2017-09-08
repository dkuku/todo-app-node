
//`const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unabloe to connect to MongoDB server');
    }
        //deleteMany
    //    db.collection('Todos').deleteMany({text:'lunch'}).then((result) => {
    //    console.log(result);
    //    })    
        //deleteOne
    //        db.collection('Todos').deleteOne({text:'eat lunch'}).then((result) => {
    //        console.log(result);
    //        })    
    //        db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
    //        console.log(result);
    //        })    
                

    //findOneAnd Delete
    //        db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
    //        console.log(result);
        //deleteMany
    //    db.collection('Users').deleteMany({name: "Bianka"}).then((result) => {
    //        console.log(result);
    //    })    
    //        //deleteOne
    db.collection('Users').deleteOne({_id: new ObjectID('59b151cec3db3acf615d0f18')} ).then((result) => {
        console.log(result);
    })    
    //        db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
    //        console.log(result);
    //        })    
        
    //db.close();
});


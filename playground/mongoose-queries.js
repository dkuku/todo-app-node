const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');


//var id = '59b404743c8e427aee6496ff11';
//
//if (!ObjectID.isValid(id)) {
//    console.log('ID not valid');
//}

//Todo.find({
//    _id: id
//}).then((todos) => {
//    console.log('Todos', todos);
//});
//
//Todo.findOne({
//    _id: id
//}).then((todo) => {
//    console.log('Todo', todo);
//});

//Todo.findById(id).then((todo) => {
//    if (!todo){
//        return console.log('Id not found');
//    }
//    console.log('Todo by id', todo);
//}).catch((e) => console.log(e));

// Query user bu ID

var id = '59b29d8a0079bf3bb05210de';

if (!ObjectID.isValid(id)) {
    console.log('ID not valid');
}

User.find({
    _id: id
}).then((user) => {
    if (!user) {
        return console.log('unable to find user');
    }    
    console.log(JSON.stringify((user), undefined, 2));
    console.log(`${user.email} has id ${id}`);
}, (e) => {
    console.log(`error ${e}`)
});


//query users by id
//
//User.fingbyId

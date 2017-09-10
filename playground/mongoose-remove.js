const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

//Todo.remove({}).then((result) => {
//    console.log(result);
//})
Todo.findOneAndRemove({text: 'aaaa'}).then((todo) => {
console.log(todo);
});

Todo.findByIdAndRemove('59b4acfbc3db3acf615d0f22').then((todo) => {
console.log(todo);
});


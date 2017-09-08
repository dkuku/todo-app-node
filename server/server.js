var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp', {useMongoClient: true});

var Todo = mongoose.model('Todo', {
    text:{
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
});

//var newTodo = new Todo({
//    text: "Cook dinner",
//});
//
//var newTodo = new Todo({
//    text: '  texxxxt    '
//   text: 'have a good day',
//   completed: true,
//   completedAt: 11122
//});
var User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    name: {
        type: String,
        required: true,
        minlenght: 1,
        trim: true
    }
});

var newUser = new User({
    name: "Daniel",
    email: "aaa@ala"
});
//newTodo.save().then((doc) => {
//console.log(JSON.stringify(doc))
//}, (e) => {
// console.log('Unable to save todo');
//});
//
newUser.save().then((doc) => {
console.log(JSON.stringify(doc))
}, (e) => {
 console.log('Unable to save todo');
});



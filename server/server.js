require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port =  process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    }
    )
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({
            todos
        });
    }, (e) => {
        res.status(400).send(e);
    })
});

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;

    //validate id
    if (!ObjectID.isValid(id)) {
        console.log('ID not valid');
        return res.status(404).send();
    } else {
        Todo.findById(id).then((todo) => {
            if (!todo) {
                console.log('Could not find TODO with this ID');
                return res.status(404).send();
            } 
            // Sending response with todo
            res.send({todo});
        }).catch((e) => {
            return res.status(400).send();
        });
        }
});

app.delete('/todos/:id', (req, res) => {
 var id = req.params.id;
    
    if (!ObjectID.isValid(id)) {
        console.log('ID not valid');
        return res.status(404).send();
    } else {
        Todo.findByIdAndRemove(id).then((todo) => {
            if (!todo) {
                console.log('Could not find TODO with this ID');
                return res.status(404).send();
            } 
            // Sending response with todo
            res.status(200).send({todo});
        }).catch((e) => {
            return res.status(400).send();
        });
        }
});

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);
    console.log(body);
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    } else { 
        if (_.isBoolean(body.completed) && body.completed) {
            body.completedAt = new Date().getTime();
        } else {
            body.completed = false;
            body.completedAt = null;
        }   

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        } 
        // Sending response with todo
        res.send({todo});
    }).catch((e) => {
        return res.status(400).send();
    });
    }

});

app.listen(port, () => {
console.log(`server started on port ${port}`);
});

module.exports = {app}

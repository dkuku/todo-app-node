const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} =  require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text';

        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

            Todo.find().then((todos) => {
                expect(todos.length).toBe(2);
                done()
            }).catch((e) => done(e));
            });
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(1);
            })
           .end(done);
    });

});

describe('GET /todos/:id', () => {
    it('should return TODO doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done)
    });
    
    it('should not return TODO doc created by other user', (done) => {
        request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done)
    });
    
    it('should return 404 if TODO not found', (done) => {
        var hexID = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${hexID}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done)
    });
    
    it('should return 404 for non object IDs', (done) => {
        request(app)
            .get(`/todos/123`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done)
    });
});

describe('DELETE /todos/:id', () =>{
    it('should remove  todo', (done) => {
        var hexID = todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${hexID}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexID);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(hexID).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((e) => done());
            });
    });

    it('should return 404 if todo not found', (done) => {
        var hexID = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${hexID}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 if object id is not valid', (done) => {
        request(app)
            .delete(`/todos/123`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

});

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        var hexID = todos[0]._id.toHexString();
        var text = 'update todo'
        var completed = true
        request(app)
            .patch(`/todos/${hexID}`)
            .set('x-auth', users[0].tokens[0].token)
            .send({text, completed})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.text).toBe(text);
                expect(typeof(res.body.todo.completedAt)).toEqual('number');
            })
        .end(done);
        ;
    });

    it('should not update the todos from other users', (done) => {
        var hexID = todos[1]._id.toHexString();
        var text = 'update todo'
        var completed = true
        request(app)
            .patch(`/todos/${hexID}`)
            .set('x-auth', users[0].tokens[0].token)
            .send({text, completed})
            .expect(404)
        .end(done);
        ;
    });

    it('should clear completedAt when todo is not completed', (done) => {
        var hexID = todos[1]._id.toHexString();
        var text = 'update todo'
        var completed = false
        request(app)
            .patch(`/todos/${hexID}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({text, completed})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completedAt).toNotExist();
            })
        .end(done);
        ;
    
    });
});

describe('GET /users/me', () => {
    it('should return user if authenticate', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', '')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});


describe('POST /users', () => {
    it('should create a user', (done) => {
        var email = 'email@email.com';
        var password = '123abc!';

        request(app)
            .post(`/users/`)
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.header['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            }).end((err) => {
                if (err){
                    return done(err);
                }
                User.findOne({email}).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                }).catch((e) => {
                    done(e);
                });
            });
    });

    it('should return validation error if request invalid', (done) => {
        var empty = "";
        request(app)
            .post('/users')
            .send({empty, empty})
            .expect(400)
            .expect((res) => {
                expect(res.body._message).toEqual("User validation failed");
            })
            .end(done);
    });

    it('should not create user if email in use', (done) => {
        request(app)
            .post('/users')
            .send({
                email: users[0].email,
                password: 'password123'
            })
            .expect(400)
            .expect((res) => {
            
            })
            .end(done);
    
    })
});

describe('POST /users/login',() => {
    it('should login user with correct user and password', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[0].email, 
                password: 'userOnePass'
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.email).toBe(users[0].email);
                expect(res.body._id).toExist();
                expect(res.header['x-auth']).toExist();
            })
            .end(done);
    });

    it('should respond 400 for user wirh bad pass', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[0].email,
                password: 'badPass'
            })
            .expect(400)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
    
    it('should respond 400 for user with wrong email', (done) => {
        request(app)
            .post('/users/login')
            .send({email: 'bad@email.ap',
                password: 'badPass'
            })
            .expect(400)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users/login',() => {
    it('should login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email, 
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.email).toBe(users[1].email);
                expect(res.body._id).toExist();
                expect(res.header['x-auth']).toExist();
            })
            .end((err, res) => {
                if (err){
                    return done(e);
                }
                
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[1]).toInclude({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                done();
                }).catch((e) => {
                    done(e);
                });

            });
    });

    it('should respond 400 for user wirh bad pass', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: 'badPass'
            })
            .expect(400)
            .expect((res) => {
                expect(res.body).toEqual({});
                expect(res.headers['x-auth']).toNotExist();
            })
            .end((err, res) => {
                if (err){
                    return done(e);
                }
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(1);
                    done();
                }).catch((e) => {
                    done(e);
                });

            });
    });
});

describe('DELETE /users/me/token', () => {
    it('should remoe auth token when logging out', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .send()
            .expect(200)
            .end((err, res) => {
                if (err){
                    return done(e);
                }
                
                User.findById(users[0]._id).then((user) => {
                    expect(user.tokens[0]).toNotExist();
                done();
                }).catch((e) => {
                    done(e);
                });

            });

    })
});

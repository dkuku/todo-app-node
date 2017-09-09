var mongoose = require('mongoose');


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

module.exports = {User};

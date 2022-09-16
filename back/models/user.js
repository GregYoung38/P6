const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema_for_user = mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    }
});

Schema_for_user.plugin(uniqueValidator);

module.exports = mongoose.model("user", Schema_for_user);
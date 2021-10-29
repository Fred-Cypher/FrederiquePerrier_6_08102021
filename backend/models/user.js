const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); // Vérifie qu'une adresse mail ne peut être utilisée qu'une fois

module.exports = mongoose.model('User', userSchema);
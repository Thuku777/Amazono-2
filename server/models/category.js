
const mongoos = require('mongoose');
const Schema = mongoos.Schema;

const categorySchema = new Schema({
    name: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },
    description: {
        type: String,
        required: false
    }
},{timestamps: true});

module.exports = mongoos.model('Category', categorySchema);



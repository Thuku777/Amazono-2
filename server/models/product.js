
const mongoos = require('mongoose');
const Schema = mongoos.Schema;

const productSchema = new Schema({
    owner:{
        type: Schema.Types.ObjectId, ref: 'User'
    },
    category:{
        type: Schema.Types.ObjectId, ref: 'Category'
    },
    image: String,
    title: String,
    description: String,
    price: Number
},{timestamps: true});

module.exports = mongoos.model('Product', productSchema);




const mongoos = require('mongoose');
const Schema = mongoos.Schema;

const reviewSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    summary: String,
    owner:{
        type: Schema.Types.ObjectId, 
        ref: 'User'
    },
    rating: {
        type: Number, 
        default: 0
    }
},{timestamps: true});

module.exports = mongoos.model('Review', reviewSchema);



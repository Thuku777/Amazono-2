
const mongoos = require('mongoose');
const Schema = mongoos.Schema;
const deepPopulate = require('mongoose-deep-populate')(mongoos)

const productSchema = new Schema({
    owner:{
        type: Schema.Types.ObjectId, ref: 'User'
    },
    category:{
        type: Schema.Types.ObjectId, ref: 'Category'
    },
    reviews: [{
        type: Schema.Types.ObjectId, ref: 'Review'
    }],
    image: String,
    title: String,
    description: String,
    price: Number
},{
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});


productSchema
.virtual('averageRating')
.get(function (){
    let rating = 0;
    if(this.reviews.length!=0){
        let total = 0;
        this.reviews.map(review => {
            total += review.rating
        })
        rating = total/this.reviews.length
    }
    return rating;
})

productSchema.plugin(deepPopulate);
module.exports = mongoos.model('Product', productSchema);



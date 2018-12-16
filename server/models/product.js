
const mongoos = require('mongoose');
const Schema = mongoos.Schema;
const deepPopulate = require('mongoose-deep-populate')(mongoos)
const mongooseAlgolia = require('mongoose-algolia')

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
productSchema.plugin(mongooseAlgolia, {
    appId: 'EOPGHL1QPY',
    apiKey: '7132eeb05cdaf8a1dacc03ce955f51a0',
    indexName: 'amozono_v1',
    selector: '_id title image reviews description price owner created averageRating',
    populate: {
      path: 'owner reviews',
      select: 'name rating'
    },
    defaults: {
      author: 'uknown'
    },
    mappings: {
      title: function(value) {
        return `${value}`
      }
    },
    virtuals: {
      averageRating: function(doc) {
        var rating = 0;
      if (doc.reviews.length == 0) {
        rating = 0;
      } else {
        doc.reviews.map((review) => {
          rating += review.rating;
        });
        rating = rating / doc.reviews.length;
      }
  
      return rating;
      }
    },
    debug: true
  })
   
  
  let Model =  mongoos.model('Product', productSchema);
  Model.SyncToAlgolia();
  Model.SetAlgoliaSettings({
    searchableAttributes: ['title']
  });

module.exports = Model
//mongoos.model('Product', productSchema);



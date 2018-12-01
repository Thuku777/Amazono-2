
const route = require('express').Router();
const Category = require('../models/category');
const Product = require('../models/product');
const Review = require('../models/review') 
const async = require('async')
const jwt = require('../middlewares/check-jwt')

/*
const jwt = require('jsonwebtoken')
const config = require('../config');
const jwtVerify = require('../middlewares/check-jwt');
*/

route.route('/categories')
.get((req,res,next)=>{
    Category.find((err,categories)=>{
        if(err){
            res.json({
                success: false,
                message: err
            })
        }else{
            res.json({
                success: true,
                count: Object.keys(categories).length,
                categories: categories,
            });
        }
    });
})
.post((req,res,next)=>{
    let cat = new Category();
    if(!req.body.name){
        res.json({
            success: false,
            message: 'Category name is not set, cannot insert'
        })
    }else{
        cat.name = req.body.name;
        if(req.body.desc){
            cat.description = req.body.desc;
        }
        cat.save((err)=>{
            if(err){
                res.json({
                    success: false,
                    message: 'Erro in DB insretion'
                })
            }else{
                res.json({
                    success: true,
                    message: 'Successfully insreted into database'
                })
            }
        });
    }
})

route.route('/categories/:id')
.get((req,res,next)=>{
    Category.findById({_id: req.params.id},(err, category)=>{
        if(err){
            res.json({
                success: false,
                message: 'Cateogry does not exist'
            })
        }else{
            res.json({
                success: true,
                message: 'Cateogry Found',
                category: category
            })
        }
    })
})
.post((req,res,next)=>{
    Category.findById({_id: req.params.id},(err, category)=>{
        if(err){
            res.json({
                success: false,
                message: 'Cateogry does not exist'
            })
        }else{

            if(req.body.name){
                category.name = req.body.name;
            }
            if(req.body.description){
                category.description = req.body.description;
            }
            category.save((err,cat)=>{
                if(err){
                    res.json({
                        success: false,
                        message: 'Failed to update Cateogry'
                    })
                }else{
                    res.json({
                        success: true,
                        message: 'Cateogry updated successfully'
                    })
                }
            })
        }
    })
})

route.route('/products')
.get((req,res,next)=>{
    /*
    let pageindex = 0;
    if(req.query.index && req.query.index>0) pageindex = req.query.index;
    else pageindex = 0;
    */

    async.parallel([
        (callback)=>{
            Product.find()
//            .skip(pageindex*perPage)
//            .limit(perPage)
            .populate('owner')
            .populate('category')
            .exec((err,product)=>{
                if(err){
                    callback(err,null)
                }else{
                    callback(null,product)
                }
            })
        },
        (callback)=>{
            Product.find()
            .count((err,count)=>{
                if(err){
                    callback(err,null)
                }else{
                    callback(null,count)
                }
            })
        }
    ],(err,result)=>{
        if(err){
            res.json({
                success: false, 
                message: 'Error in Obtaining Product',
                error: err
            })
        }else if(result[1]==0){
            res.json({
                success: true,
                message: 'No Products Obtained',
                totalCount: result[1],
                count: result[0].length,
                products: result[0]
            })
        }else{
            res.json({
                success: true,
                message: 'Successfully Obtained Products',
                totalCount: result[1],
                count: result[0].length,
                products: result[0]
            })
        }
    });
})

route.route('/products/:id')
.get((req,res,next)=>{
    Product.findById({_id: req.params.id})
    .populate('category')
    .deepPopulate('reviews.owner')
    .exec((err, product)=>{
        if(err){
            res.json({
                success: false,
                message: 'Product does not exist'
            })
        }else{
            product.owner = undefined
            res.json({
                success: true,
                message: 'Product Found',
                product: product
            })
        }
    })
})


route.route('/products/:id/reviews')
.get(jwt,(req,res,next)=>{
    Product.findById({_id: req.params.id})
    .deepPopulate('reviews.owner')
    .exec((err,product)=>{
        if(err){
            res.json({
                success: false,
                message: 'Error in finding reviews'
            })
        }else{
            if(product.reviews.length==0){
                res.json({
                    success: false,
                    message: 'No Review for this product'
                })
            }else{
                res.json({
                    success: true,
                    reviews: product.reviews
                })
            }
        }
    })
})
.post(jwt, (req,res,next)=>{
    async.waterfall([
        (callback)=>{
            Product.findOne({_id: req.params.id},(err,product)=>{
                if(err){
                    res.json({
                        success: false,
                        message: 'No product found'
                    })
                }else{
                    callback(err,product)
                }
            })
        },
        (product)=>{
            let review = new Review();
            try{
                if(req.body.title){
                    review.owner = req.decoded.user._id
                    review.title = req.body.title;
                    if(req.body.description) review.summary = req.body.description
                    if(req.body.rating) review.rating = req.body.rating
                    else review.rating = 0
                    product.reviews.push(review._id)
                    product.save((err)=>{
                        if(err){
                            res.json({
                                success: false,
                                message: 'Error in saving the review in product',
                            })
                        }else{
                            review.save((err)=>{
                                if(err){
                                    res.json({
                                        success: false,
                                        message: 'Error in saving the review',
                                    })
                                }else{
                                    res.json({
                                        success: true,
                                        message: 'Review saved successfully',
                                    })
                                }
                            })
                        }
                    })
                }else{
                    res.json({
                        success: false,
                        message: 'Title not set (Title is mandatory)',
                    })
                }
            }catch(err){
                res.json({
                    success: false,
                    message: 'internal error',
                    error: err
                })
            }
        }
    ])
})


module.exports = route;


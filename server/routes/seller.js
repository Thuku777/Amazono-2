const router = require('express').Router();
const Product = require('../models/product');
const async = require('async');
const perPage = 5;

const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3')

const s3 = new aws.S3({
    accessKeyId: 'AKIAIPDNBQN7MNY3ITZQ',
    secretAccessKey: 'FRvnICjFmGOB2EMgVH5w7kUCUCFgG5f2SO7/Y8II'
})

const checkJWT = require('../middlewares/check-jwt');

const faker = require('faker');

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'amwebapplication',
        metadata: (req, file, cb)=>{
            cb(null, {filename: file.fieldname})
        },
        key: (req,file, cb)=>{
            cb(null, Date.now().toString())
        }
    })
})

router.route('/products')
.get(checkJWT, (req,res,next)=>{
    let pageindex = 0;
    if(req.query.index && req.query.index>0) pageindex = req.query.index;
    else pageindex = 0;

    async.parallel([
        (callback)=>{
            Product.find({owner: req.decoded.user._id})
            .skip(pageindex*perPage)
            .limit(perPage)
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
            Product.find({owner: req.decoded.user._id})
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
.post(checkJWT, upload.single('product_picture'),(req,res,next)=>{

    let product = new Product();
    product.owner = req.decoded.user._id;
    if(!req.body.categoryid){
        res.json({
            success: false,
            message: 'Category ID is null, Cannot insert in DB'
        });
    }else{
        product.category = req.body.categoryid;
        if(!req.body.title){
            res.json({
                success: false,
                message: 'Product needs a name.please insert name'
            });
        }else{
            product.title = req.body.title;
            product.description = req.body.description;
            product.price = req.body.price;
            product.image = req.file.location;
        
            product.save((err)=>{
                if(err){
                    res.json({
                        success: false,
                        message: 'Failed to insert in DB'
                    });
                }else{
                    res.json({
                        success: true,
                        message: 'Product added successfully'
                    });
                }
            });
        }
    }
});

router.route('/products/:id')
.get((req,res,next)=>{
    Product.findById({_id: req.params.id})
    .populate('owner')
    .populate('category')
    .exec((err, product)=>{
        if(err){
            res.json({
                success: false,
                message: 'Product does not exist'
            })
        }else{
            res.json({
                success: true,
                message: 'Product Found',
                product: product
            })
        }
    })
})
.post((req,res,next)=>{
    Product.findById({_id: req.params.id},(err, product)=>{
        if(err){
            res.json({
                success: false,
                message: 'Product does not exist'
            })
        }else{

            if(req.body.name) product.name = req.body.name;
            if(req.body.description) product.description = req.body.description;
            if(req.body.price) product.price = req.body.price;

            product.save((err,pro)=>{
                if(err){
                    res.json({
                        success: false,
                        message: 'Failed to update Product'
                    })
                }else{
                    res.json({
                        success: true,
                        message: 'Product updated successfully'
                    })
                }
            })
        }
    })
})


//All products under one category of that Seller
router.route('/category/:id')
.get(checkJWT,(req,res,next)=>{
    let pageindex = 0;
    if(req.query.index && req.query.index>0) pageindex = req.query.index;
    else pageindex = 0;

    async.parallel([
        (callback)=>{
            //Finding products
            Product.find({category: req.params.id})
            .skip(pageindex*perPage)
            .limit(perPage)
            .populate('category')
            .populate('owner')
            .exec((err,products)=>{
                if(err){
                    callback(err,null)
                }else{
                    callback(null,products)
                }
            })
        },
      (callback)=>{
          //finding total product count
        Product.find({category: req.params.id})
        .count((err,count)=>{
            if(err){
                callback(err,null);
            }else{
                callback(null,count);
            }
        })
      }
    ],(err,result)=>{
        if(err){
            res.json({
                success: false, 
                message: 'Error in Obtaining Products',
                error: err
            })
        }else if(result[1]==0){
            res.json({
                success: true,
                message: 'No Product Obtained',
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





/**
 * Just for testing
 * Adding random product insertion
 */
router.route('/fake')
.post((req,res,next)=>{

    for(let i = 0; i<20; i++){
        let product = new Product();

        product.owner = '5bcc23c14f8ab309c84b9ba7';
        product.category = '5be6cdbae838a11498ed638a';
        product.title = faker.commerce.product();
        product.description = faker.lorem.lines(2);
        product.price = faker.commerce.price();
        product.image = faker.image.cats();

        product.save();
    }
    res.json({
        success: true,
        message: 'Successful'
    });
})

router.route('/test')
.get((req,res,next)=>{
    callback()

})

module.exports = router


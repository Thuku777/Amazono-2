const router = require('express').Router();
const Product = require('../models/product');

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
    Product.find({owner: req.decoded.user._id})
    .populate('owner')
    .populate('category')
    .exec((err,product)=>{
        if(err){
            res.json({
                success: false,
                message: err
            })
        }else{
            res.json({
                success: true,
                message: 'Success',
                product: product
            })
        }
    });
})
.post(checkJWT, upload.single('product_picture'),(req,res,next)=>{
//    console.log(upload);
//    console.log(req.file);

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

module.exports = router


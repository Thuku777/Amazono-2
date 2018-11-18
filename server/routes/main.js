
const route = require('express').Router();
const Category = require('../models/category');

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

module.exports = route;


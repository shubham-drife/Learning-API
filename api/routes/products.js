const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const product = require('../models/product');
const Product = require('../models/product');
const checkAuth = require('../middleware/check-auth');

router.get('/',async (req, res, next) => {
    
    
    const docs = await product.find();
    try{
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + doc._id
                    }
                }
            })
        }
        res.status(200).json(response); 
    }catch(err){
        console.log(err);
        res.status(500).json({
            message: "Some problem",
            error: err
        })
    }
    
    
    // Product.find()
    // .select('name price _id')
    // .exec()
    // .then(docs => {
    //     const response = {
    //         count: docs.length,
    //         products: docs.map(doc => {
    //             return {
    //                 name: doc.name,
    //                 price: doc.price,
    //                 _id: doc._id,
    //                 request: {
    //                     type: 'GET',
    //                     url: 'http://localhost:3000/products/' + doc._id
    //                 }
    //             }
    //         })
    //     }
    //     res.status(200).json(response);
    // })
    // .catch(err => {
    //     console.log(err);
    //     res.status(500).json({
    //         message: "Some problem",
    //         error: err
    //     })
    // })
});

router.post('/', checkAuth, async (req, res, next) => {
    //console.log(req);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    const result = await product.save();
    try{
        console.log(result);
        res.status(201).json({
            message : 'Created product successfully ',
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/products/' + result._id
                }
            }
        });
    }catch(err){
        console.log(err);
        res.status(500).json({
            error: err
        })
    }

    // product
    // .save()
    // .then(result => {
    //     console.log(result);
    //     res.status(201).json({
    //         message : 'Created product successfully ',
    //         createdProduct: {
    //             name: result.name,
    //             price: result.price,
    //             _id: result._id,
    //             request: {
    //                 type: 'POST',
    //                 url: 'http://localhost:3000/products/' + result._id
    //             }
    //         }
    //     });
    // })
    // .catch(err => {
    //     console.log(err);
    //     res.status(500).json({
    //         error: err
    //     })
    // });
    
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
    .exec()
    .then(doc => {
        console.log("From database", doc);
        if(doc){
            res.status(200).json(doc);
        }else{
            res.status(404).json({message: "No valid entry found for provided ID"})
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    })
});

router.delete('/:productId', checkAuth, (req, res, next) => {
    const id = req.params.productId;
    Product.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
});

router.patch('/:productId', checkAuth, (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    
    Product.update({ _id: id}, { $set: updateOps})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
});

module.exports = router;
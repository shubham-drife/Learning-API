const express = require('express');
const { resetWatchers } = require('nodemon/lib/monitor/watch');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message : 'Handling GET requests /products'
    });
});

router.post('/', (req, res, next) => {
    const product = {
        name: req.body.name,
        price: req.body.price
    }
    res.status(201).json({
        message : 'Handling POST requests /products',
        createdProduct: product
    });
});

router.get('/:produstId', (req, res, next) => {
    const Id = req.params.produstId;
    if ( Id === 'special' ){
        res.status(200).json({
            message : "this is the special ID",
            Id : Id
        });
    }else { 
        res.status(200).json({
            message : "this is just a normal Id"
        });
    }
});

router.delete('/:produstId', (req, res, next) => {
    res.status(200).json({
        message : 'Deleted product'
    });
});

router.patch('/:produstId', (req, res, next) => {
    res.status(200).json({
        message : 'Updated product'
    });
});

module.exports = router;
const mongoose = require("mongoose");

const Order = require("../models/order");
const Product = require("../models/product");

exports.orders_get_all =  async (req, res, next) => {
    
    const docs = await Order.find();
    try{
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc => {
                return {
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: 'http//localhost:3000/orders/' + doc._id
                    }
                }
            })
        });
    }catch(err){
        res.status(500).json({
            error: err
        })
    }
}

exports.orders_create_order = (req, res, next) => {
    
    Product.findById(req.body.productId)
        .then(product => {
            if(!product){
                return res.status(404).json({
                    message: "product not found"
                })
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order.save()
            
    })
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: "Order stored",
            createdOrder: {
                _id: result._id,
                product: result.product,
                quantity: result.quantity
            },
            request: {
                type: 'GET',
                url: 'http//localhost;3000/orders/' + result._id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: "somethig is wrong",
            error: err
        })
    })
    
}

exports.orders_get_order = (req, res, next) => {
    Order.findById(req.params.orderId)
    //.populate('product')
    .exec()
    .then(order => {
        if(!order){
            return res.status(404).json({
                message: "order not found"
            })
        }
        res.status(200).json({
            order: order,
            request: {
                type: 'GET',
                url: 'http//localhost;3000/orders/'
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
}

exports.orders_delete_order = async (req, res, next) => {
    
    const result = await Order.remove({_id: req.params.orderId});
    try{
        res.status(200).json({
            message: "Order deleted",
            request: {
                type: 'Delete',
                url: 'http//localhost;3000/orders/',
                body: {productId: "ID", quantity: "Number"}
            }
        })
    }catch(err){
        res.status(500).json({
            error: err
        })
    }
}
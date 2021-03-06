const express = require("express");
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

mongoose.connect('mongodb+srv://Shubham:9829904101@cluster0.cuol0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {});

mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cors());

// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", '*');
//     res.header(
//         "Access-Control-Allow-Headers",
//         "*"
//     );
//     if(req.method === 'OPTIONS'){
//         res.header('Access-Control-Allow-Methods', '*');
//         return res.status(200).json({});
//     }
// })

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
})

app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;

//bnkdjbfk
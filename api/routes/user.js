const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const user = require('../models/user');
const jsonwebtoken = require('jsonwebtoken');

router.post("/signup", async (req, res, next) => {
    
    
    const user = await User.find({email: req.body.email});
    try{
        if(user.length >=1){
            res.status(409).json({
                message: "Mail exists"
            })
        }else{
            bcrypt.hash(req.body.password, 10, async (err, hash)=>{
                if(err){
                    return res.status(500).json({
                        error: err
                    });
                }else{
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });

                    const result = await user.save();
                    try{
                        console.log(result);
                        res.status(201).json({
                            message: 'User created'
                        });
                    }catch(err){
                        console.log(err);
                        res.status(500).json({
                            error: err
                        })
                    }
                }
            })
        }
    }catch(err){
        console.log(err);
        res.status(500).json({
            error: err
        })
    }
    
    
    // User.find({email: req.body.email})
    // .exec()
    // .then(user => {
    //     if(user.length >=1){
    //         res.status(409).json({
    //             message: "Mail exists"
    //         })
    //     }else{
    //         bcrypt.hash(req.body.password, 10, (err, hash)=>{
    //             if(err){
    //                 return res.status(500).json({
    //                     error: err
    //                 });
    //             }else{
    //                 const user = new User({
    //                     _id: new mongoose.Types.ObjectId(),
    //                     email: req.body.email,
    //                     password: hash
    //                 });
    //                 user
    //                 .save()
    //                 .then(result => {
    //                     console.log(result);
    //                     res.status(201).json({
    //                         message: 'User created'
    //                     });
    //                 })
    //                 .catch(err =>{
    //                     console.log(err);
    //                     res.status(500).json({
    //                         error: err
    //                     })
    //                 });
    //             }
    //         })
    //     }
        
});

    router.post('/login', (req, res, next)=>{
        User.find({email: req.body.email})
        .exec()
        .then(user => {
            if(user.length < 1){
                return res.status(401).json({
                    message: 'Mail not found, user do not exist'
                });
            }
            //console.log(user);
            // const pass = bcrypt.compare(req.body.password, user[0].password);
            // console.log(pass);
            // if(pass){
            //     res.status(200).json({
            //         message: "Auth successful"
            //     })
            // }else{
            //     res.status(401).json({
            //         message: 'Auth failed'
            //     })
            // }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if(err){
                    return res.status(401).json({
                        message: 'Mail not found, user do not exist'
                    });
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        "Jwt-Private-Key",
                        {
                            expiresIn: "1h"
                        }
                    );
                    //console.log(token);
                    return res.status(200).json({
                         message: "Auth successful",
                        token: token
                    });
                }
                // console.log(req.body.password);
                // if(result){
                //     res.status(200).json({
                //         message: "Auth successful"
                //     })
                // }
                res.status(401).json({
                    message: 'Auth failed'
                })
            })

        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            })
        });

    });

    router.delete('/:userId', async (req, res, next) => {
        const id = req.params.userId;

        const result = await User.remove({_id: id});
        try{
            res.status(200).json({
                message: "User deleted"
            });
        }catch(err){
            console.log(err);
            res.status(500).json({
                error: err
            })
        }

        // User.remove({_id: id})
        // .exec()
        // .then(result => {
        //     res.status(200).json({
        //         message: "User deleted"
        //     });
        // })
        // .catch(err => {
        //     console.log(err);
        //     res.status(500).json({
        //         error: err
        //     })
        // })
    });

module.exports = router;
const express = require('express');
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');
const { options } = require('.');

const favoriteRouter = express.Router();

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res, next) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({ user:req.user._id })
    .populate('User') 
    .populate('Campsite')  
    .then(favorites => {
        console.log(favorites)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites); 
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user:req.user._id})
    .then(favorites => {
        if (favorites) {
            req.body.forEach(entry => {
                if (!favorites.campsites.includes(entry._id)) {
                    favorites.campsites.push(entry._id);
                }
                    favorites.save();
                    console.log('Favorite added to existing array')
                    res.statusCode = 200; 
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorites);
                })                
        } else {
        Favorite.create({ user: req.user._id })  
        .then(favorites => {
            req.body.forEach(entry => {
                favorites.campsites.push(entry._id)
            })
            console.log('Favorite Created', favorite);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
        }) 
        .catch(err => next(err));
        }           
    })
    .catch(err => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({user: req.user._id })
    .then(favorite => {
        if (favorite) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
        } else {
            res.setHeader('Content-Type', 'text/plain');
            res.end('You do not have any favorites to delete')
        }
    })
    .catch(err => next(err));
});

module.exports = favoriteRouter;

const express = require('express');
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');

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
            let message = "Campsites already added";
            req.body.forEach(entry => {
                console.log("entry", entry);
                console.log(favorites.campsites.includes(entry._id));
                console.log(favorites.campsites);
                if (!favorites.campsites.includes(entry._id)) {
                    favorites.campsites.push(entry._id);
                    favorites.save();
                    console.log('Favorite added to existing array');
                    message = "NEW campsite added";
               }
             });
            res.statusCode = 200; 
            res.setHeader('Content-Type', 'text/plain');
            res.end(message);      
        } else {
        Favorite.create({ user: req.user._id })  
        .then(favorites => {
            req.body.forEach(entry => {
                favorites.campsites.push(entry._id)
            })
            favorites.save();
            console.log('Favorite Created', favorites);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorites);
        }) 
        .catch(err => next(err));
        }           
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported')
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({ user: req.user._id })
    .then(response => {
        if (response) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        } else {
            res.statusCode = 403;
            res.setHeader('Content-Type', 'text/plain');
            res.end('You do not have any favorites to delete')
        }
    })
    .catch(err => next(err));
});

favoriteRouter.route('/:campsiteId')
.options(cors.corsWithOptions, (req, res, next) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('GET operation not supported')
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
    .then(favorites => {
        if (favorites) {
           if (!favorites.campsites.includes(req.params.campsiteId)) {
               favorites.campsites.push({ "_id":req.params.campsiteId });
               favorites.save();
               res.statusCode = 200;
               res.setHeader('Content-Type', 'application/json');
               res.json(favorites);
            } else {
               console.log('Campsite already in the list of favorites');
               res.statusCode = 200;
               res.setHeader('Content-Type', 'application/json');
               res.end('That campsite is already a favorite!');
           }
        } else {
            Favorite.create({ user: req.user._id })
            .then(favorites => {
                favorites.campsites.push({ "_id":req.params.campsiteId });
                favorites.save();
                console.log('Favorite Created', favorites);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);            
            })
            .catch(err => next(err));          
        }
    }).catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported')
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
    .then(favorites => {
        if (favorites && favorites.campsites.includes(req.params.campsiteId)) {
            const campsiteIndex = favorites.campsites.indexOf(req.params.campsiteId);
            favorites.campsites.splice(campsiteIndex, 1);
        } else {
           res.statusCode = 401;
           res.setHeader('Content-Type', 'text/plain');
           res.end('There are no favorites to delete'); 
        }
        favorites.save();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    })
    .catch(err => next(err));
});

module.exports = favoriteRouter;

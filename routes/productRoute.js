require('dotenv').config();
const express = require('express');
const route = express.Router();
const mongoose = require('mongoose');
const url = require('url');
require('../db/connection');
const cookieParser = require('cookie-parser');
const auth = require('../middleware/auth');
const Listings = require('../models/listings');

// route.use(express.json());
route.use(express.urlencoded({
    extended: false,
}));
route.use(cookieParser());


//find data from database for home page
async function findData() {
    let data = await Listings.find().sort({ $natural: -1 }).limit(20);
    return data;
}
//find a single listing data for property card using id
async function findSingle(id) {
    let data = await Listings.find({ _id: { $eq: id } });
    return data;
}
//home route
route.get('/', async (req, res) => {
    let data = await findData();
    res.render('index', {
        data: data,
    });
});
//property page route
route.get('/property/:id', async (req, res) => {
    let data = await findSingle(req.params.id);
    res.render('property', {
        data: data
    })
});

//host page route
route.get('/hostRooms', auth, (req, res) => {
    res.render('hostRooms');
})
//host post route to save data in database
route.post('/hostRooms', async (req, res) => {
    const data = new Listings({
        _id: mongoose.Types.ObjectId(),
        name: req.body.property_title,
        price: req.body.price,
        address: {
            country: req.body.country,
            market: req.body.market,
            government_area: req.body.government_area,
        },
        images: {

            picture_url: req.body.pictureurl
        },
        description: req.body.description,
        access: req.body.acces,
        property_type: req.body.property_type,
        room_type: req.body.room_type,
        bedrooms: req.body.bedrooms,
        beds: req.body.beds,
        bathrooms: req.body.bathrooms,
        guests_included: req.body.guests_included,
        host: {
            host_name: req.body.host_name
        }
    })
    data.save(function (error) {
        if (error) {
            console.log(error);
        } else {
            console.log("Document saved with _id: " + data._id);
            res.render('hostSucces')
        }
        mongoose.connection.close();
    });
});

//for search route
route.get('/search', async (req, res) => {
    const searchfield = req.query.query;
    let data = await Listings.find(
        {
            "$or": [
                { "name": { $regex: searchfield } },
                { "address": { $regex: searchfield } },
            ]
        }
    ).limit(40)
    res.render('search', {
        data: data,
        searchfield: searchfield
    });
})
module.exports = route;

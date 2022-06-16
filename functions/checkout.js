const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase, "checkout");
const express = require('express');
const app = express();

const stripe = require('stripe')(functions.config().keys.test_secret_key);

app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "https://pokemoncardshipping.web.app");
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
});

app.post('/', async (req, res) => {

    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price: 'price_1LAwqYIq5jtAROBZmfkUgX1Q',
                quantity: parseInt(req.body.quantity),
            },
        ],
        mode: 'payment',
        metadata: {"idList": req.body.idList},
        success_url: 'https://pokemoncardshipping.web.app/checkoutsuccess',
        cancel_url: 'https://pokemoncardshipping.web.app/checkoutfailure',
    });

    res.json({url: session.url});
});

exports.checkout = functions.https.onRequest(app);
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const checkout = require('./checkout');
const webhook = require('./webhook');
const orderMail = require('./orderMail');
exports.checkout = checkout.checkout;
exports.webhook = webhook.webhook;
exports.orderMail = orderMail.orderMail;
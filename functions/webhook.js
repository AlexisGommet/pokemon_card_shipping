const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase, "webhook");
const express = require('express');
const db = admin.firestore();
const app = express();

const stripe = require('stripe')(functions.config().keys.test_secret_key);

const endpointSecret = functions.config().keys.webhook_secret_test;

app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
});

const fulfillOrder = async (session) => {
    const doc = await db.collection("Orders").doc(session.id).get();
    const docData = doc.data();
    const idList = docData.idList.split(",");

    idList.forEach((item) => {
        db.collection("Cards").doc(item).update({
            status: "paid"
        })
        .then(() => {
            console.log("Card Document successfully updated! Status : Paid");
        })
        .catch((error) => {
            console.error("Error updating document: ", error);
        });
    });

    db.collection("Orders").doc(session.id).update({
        status: "paid"
    })
    .then(() => {
        console.log("Order Document successfully updated! Status : Paid");
    })
    .catch((error) => {
        console.error("Error updating document: ", error);
    });
}

const createOrder = async (session) => {
    await db.collection("Orders").doc(session.id).set({
        status: "waiting",
        idList: session.metadata.idList
    })
    .then(() => {
        console.log("Document written with ID: ", session.id);
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
}

const FailedPayment = (session) => {
    db.collection("Orders").doc(session.id).update({
        status: "failed",
    })
    .then(() => {
        console.log("Order Document successfully updated! Status : Failed");
    })
    .catch((error) => {
        console.error("Error updating document: ", error);
    });
}

const ExpiredSession = (session) => {
    db.collection("Orders").doc(session.id).update({
        status: "expired",
    })
    .then(() => {
        console.log("Document successfully updated!");
    })
    .catch((error) => {
        console.error("Error updating document: ", error);
    });
}

const Dispatch = async (event) => {
    const session = event.data.object;
    switch (event.type) {
        case 'checkout.session.completed': {

            await createOrder(session);

            if (session.payment_status === 'paid') {
                fulfillOrder(session);
            }
            break;
        }

        case 'checkout.session.async_payment_succeeded': {
            fulfillOrder(session);
            break;
        }

        case 'checkout.session.async_payment_failed': {
            FailedPayment(session);
            break;
        }

        case 'checkout.session.expired': {
            ExpiredSession(session);
            break;
        }
    }
}

app.post('/', (request, response) => {

    let event;

    if (endpointSecret) {

        const signature = request.headers['stripe-signature'];

        try {
            event = stripe.webhooks.constructEvent(
                request.rawBody,
                signature,
                endpointSecret
            );
        } catch (err) {
            console.log(`⚠️  Webhook signature verification failed.`, err.message);
            return response.sendStatus(400);
        }

        Dispatch(event);  
    }

    response.status(200).json({received: true});
});

exports.webhook = functions.https.onRequest(app);
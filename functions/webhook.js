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

async function fulfillOrder (session) {
    
    const doc = await db.collection("Orders").doc(session.id).get();
    const idList = doc.data().idList.split(",");
    let batch = db.batch();

    idList.forEach((item) => {
        batch.update(db.collection("Cards").doc(item), {
            status: "paid"
        });
    });

    batch.update(db.collection("Orders").doc(session.id), {
        status: "paid",
        session: JSON.stringify(session)
    });

    try{
        await batch.commit();
        console.log(`Updated Order and ${idList.length} Card Documents successfully ! Status : Paid`);
    }catch(error){
        console.error("Error updating documents : ", error);
        throw `${error}`;
    }  
}

async function createOrder (session) {

    try{
        await db.collection("Orders").doc(session.id).set({
            status: "waiting",
            idList: session.metadata.idList,
            orderInfo: session.metadata.orderInfo,
            session: JSON.stringify(session)
        })
        console.log("Document written with ID : ", session.id);
    }catch(error){
        console.error("Error creating Order document : ", error);
        throw `${error}`;
    } 
}

async function FailedPayment (session) {

    try{
        await db.collection("Orders").doc(session.id).update({
            status: "failed",
            session: JSON.stringify(session)
        })
        console.log("Order Document successfully updated! Status : Failed");
    }catch(error){
        console.error("Error updating Order document with status failed : ", error);
        throw `${error}`;
    } 
}

async function ExpiredSession (session) {

    try{
        await db.collection("Orders").doc(session.id).update({
            status: "expired",
            session: JSON.stringify(session)
        })
        console.log("Order Document successfully updated! Status : Expired");
    }catch(error){
        console.error("Error updating Order document with status expired : ", error);
        throw `${error}`;
    } 
}

async function Dispatch (event) {

    const session = event.data.object;

    switch (event.type) {

        case 'checkout.session.completed': {

            try{
                await createOrder(session);
            }catch(error){
                throw `${error}`;
            }
        
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

app.post('/', async (request, response) => {

    let event;

    if (endpointSecret) {

        const signature = request.headers['stripe-signature'];

        try {
            event = stripe.webhooks.constructEvent(
                request.rawBody,
                signature,
                endpointSecret
            );
        } catch (error) {
            console.error(`⚠️  Webhook signature verification failed.`, error.message);
            return response.sendStatus(400);
        }

        try{
            await Dispatch(event);
            response.status(200).json({received: true}); 
        }catch(error){
            console.error(`⚠️  Request processing failed.`, error.message);
            return response.sendStatus(400);
        }      
    }  
});

exports.webhook = functions.https.onRequest(app);
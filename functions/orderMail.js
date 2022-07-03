const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase, "orderMail");
const express = require('express');
const elasticemail = require('elasticemail');
const app = express();

app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
});

app.post('/', async (request, response) => {

    const api_key = functions.config().keys.elastickey;
  
    const client = elasticemail.createClient({
        username: api_key,
        apiKey: api_key
    });
    
    const msg = {
        from: 'pokepostie1@gmail.com',
        from_name: 'PokePostie',
        to: request.body.mail,
        subject: 'Votre commande PokePostie',
        body_text: "Merci d'avoir choisi PokePostie\n\nVoici votre commande :\n\nCartes : "+request.body.quantity+"\nTotal : "+request.body.quantity+".00 €\n\n\n\n"
    };

    client.mailer.send(msg, function(error, result) {
        if (result.includes("Error")) {
            console.error("Failed to send Email \n", result);
            response.sendStatus(400);
            return;
        }    
        console.log("Email sent successfully", result);
        response.sendStatus(200);
    }); 
});

exports.orderMail = functions.https.onRequest(app);
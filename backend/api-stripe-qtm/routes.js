const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
//import controllers
const { 
    
    createPaymentIntentByCard, 
    confirmPaymentIntent,
    fundsTransfer,
    checkStatusPaymentIntent
} = require("./controllers/stripePaymentIntent");

const { validateCard } = require("./controllers/stripeCard");

const { refund } = require("./controllers/stripeRefund");

const { createAccountConnected } = require("./controllers/stripeAccount");

const { cancelPayment } = require("./controllers/stripeCancelPayment");

//middlewares
const createCardToken = require("./middlewares/createCardToken");
const checkPaymentIntent = require("./middlewares/checkPaymentIntent");
const checkPaymentForRefund = require("./middlewares/checkPaymentForRefund");
const processTransfersOnRefund = require("./middlewares/processTransfersOnRefund");

//Routes
    //create a payment intent
    router.post("/create-payment-intent", createCardToken, createPaymentIntentByCard);

    //confirm the intent payment
    router.get("/confirm-payment-intent", confirmPaymentIntent);

   

    //cancel payment intent
    router.get("/cancel-payment-intent", checkPaymentIntent, cancelPayment);
    

    //refund
    router.post("/refund-payment", checkPaymentForRefund, processTransfersOnRefund, refund);

    //validate a card
    router.post("/validate-card", validateCard);

    //created account connected
    router.post("/create-account-connected", createAccountConnected);

    //transfer funds
    router.post("/transfer-funds", fundsTransfer);

    //check status payment intent
    router.get("/check-status-payment-intent", checkStatusPaymentIntent);

module.exports = router;    
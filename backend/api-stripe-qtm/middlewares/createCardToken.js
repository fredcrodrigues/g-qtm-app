const stripeUseCases = require("../external/stripe")

const createCardToken = async (req, res, next) => {

    responsePayment = {};

    try {

        const token = await stripeUseCases.createCardToken(req.body.card)

        //add card token in header request
        req.tokenCard = token.id;

        return next();

    } catch (error) {
        console.log(error.hasOwnProperty("message") && error.message);
        responsePayment = {
            status: 500,
            message: "Internal error",
            paymentDetails: {
                paymentId: ""
            }
        };
        return res.status(500).json(responsePayment);
    }
}

module.exports = createCardToken;

//format body request
/*
{
    number: String,
    expMonth: String,
    expYear: String,
    cvc: String
}
*/
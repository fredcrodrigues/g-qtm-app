const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const checkPaymentIntent = async (req, res, next) => {
    
    const { paymentIntentId } = req.params.hasOwnProperty("paymentIntentId") ? req.params : req.query;

    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(
            paymentIntentId
        );

        var statusPaymentIntent = paymentIntent.status;

        if(statusPaymentIntent=="canceled"){
            return res.status(400).json({
                message: "payment intent canceled",
                status: "canceled"
            })
        }else if(statusPaymentIntent=="succeeded"){
            return res.status(400).json({
                message: "payment intent succeeded",
                status: "succeeded"
            })
        }else{
            req.body = {
                ...req.body,
                amount: paymentIntent.amount
            }
            next()
        }
    } catch (error) {
        return res.status(500).json({
            message: error?.message,
            status: "error"
        })
    }
}

module.exports = checkPaymentIntent;
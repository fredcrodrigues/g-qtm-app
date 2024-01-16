const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const checkPaymentForRefund = async (req, res, next) => {

    const { paymentIntentId } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(
            paymentIntentId
        );

        var statusPaymentIntent = paymentIntent.status;

        if (statusPaymentIntent != "succeeded") {
            return res.status(400).json({
                message: "payment intent canceled",
                status: "canceled"
            });
        }
        
        req.body = {
            ...req.body,
            paymentDetails: paymentIntent
        }

        next();

    } catch (error) {
        return res.status(500).json({
            message: error?.message,
            status: "error"
        })
    }
}

module.exports = checkPaymentForRefund;
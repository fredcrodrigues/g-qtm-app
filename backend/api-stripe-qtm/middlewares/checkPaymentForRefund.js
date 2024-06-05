const stripeUseCases = require("../external/stripe")

const checkPaymentForRefund = async (req, res, next) => {

    const { paymentIntentId } = req.body;

    try {
        const paymentIntent = await stripeUseCases.checkStatusPaymentIntent(
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
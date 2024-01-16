require('dotenv').config()
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = {
    cancelPayment: async (req, res) => {
        
        const { paymentIntentId } = req.query;
        
        try {
            const paymentIntent = await stripe.paymentIntents.cancel(
                paymentIntentId
            );

            if(paymentIntent?.status=="canceled"){
                return res.status(200).json({
                    message: "payment intent cancel successful",
                    status: "canceled"
                });
            }

            return res.status(400).json({
                message: "payment intent cancel successful",
                status: "not canceled"
            });

        } catch (error) {
            console.log(error.type);
            return res.status(500).json({
                message: error?.message,
                status: error.type
            });
        }
    }
}
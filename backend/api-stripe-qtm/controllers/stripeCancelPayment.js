const stripeUseCases = require("../external/stripe")

module.exports = {
    cancelPayment: async (req, res) => {
        
        const { paymentIntentId } = req.query;
        
        try {
            const paymentIntent = await stripeUseCases.cancelPayment(paymentIntentId)

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
const stripeUseCases = require("../external/stripe")

module.exports = {
    refund: async (req, res) => {
        const refundPercent = 0.6;//60%

        const refundValue = refundPercent * req.body.paymentDetails.amount;

        try {

            const refund = await stripeUseCases.refundPayment({
                charge: req.body.paymentDetails.latest_charge,
                amount: refundValue
            })

            if (refund.status === "succeeded") {
                return res.status(200).json({
                    message: "refund successful",
                    status: "successful"
                });
            }

            res.status(400).json({
                message: "refund failed",
                status: "failed"
            })

        } catch (error) {
            console.log(error.message);
            return res.status(500).json({
                message: error.message,
                status: "internal error"
            });
        }
    }
}
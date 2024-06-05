const stripeUseCases = require("../external/stripe")

module.exports = {
    confirmPaymentIntent: async (req, res) => {

        const { paymentIntentId } = req.query;

        try {

            const paymentIntent = await stripeUseCases.confirmPayment(paymentIntentId)
    
            return res.status(200).json({
                message: "Payment Confimerd",
                paymentIntentId: paymentIntent.id
            });

        } catch (error) {
            return res.status(500).json({
                message: error?.message,
                status: "internal error"
            })
        }
    },
    createPaymentIntentByCard: async (req, res) => {

        const { countryPayment, amount, email } = req.body;

        var responsePayment = {
            status: 0,
            message: "",
            paymentDetails: {
                paymentId: ""
            }
        }

        try {
            
            const paymentIntent = await stripeUseCases.createPaymentIntent(amount, email, countryPayment, req.tokenCard)

            responsePayment = {
                status: 201,
                message: "Successful created payment intent!",
                paymentDetails: {
                    paymentId: paymentIntent.id
                }
            }

            return res.status(201).json(responsePayment);

        } catch (error) {
            responsePayment = {
                status: "error in payment intent created",
                message: "Internal error"
            }
            return res.status(500).json(responsePayment);
        }
    },
    fundsTransfer: async (req, res) => {

        const { paymentIntentId, countryCode, connectedAccountSellerId } = req.body;

        try {
            const retrievedPaymentIntent = await stripeUseCases.checkStatusPaymentIntent(paymentIntentId);

            const sellerPaymentPercent = 0.8 * retrievedPaymentIntent.amount;
            const platformPaymentPercent = 0.2 * retrievedPaymentIntent.amount;

            // transferencia para o terapeuta
            const transferSeller = await stripeUseCases.transferFunds({
                amount: sellerPaymentPercent, // Value in cents
                currency: countryCode,
                destination: connectedAccountSellerId,
                transfer_group: retrievedPaymentIntent.metadata.transfer_group,
                source_transaction: retrievedPaymentIntent.latest_charge
            })

            // transferencia para a plataforma (QTM)
            const transferPlatform = await stripeUseCases.transferFunds({
                amount: platformPaymentPercent, // Value in cents
                currency: countryCode,
                destination: process.env.PLATFORM_ACCOUNT,
                transfer_group: retrievedPaymentIntent.metadata.transfer_group,
                source_transaction: retrievedPaymentIntent.latest_charge
            });

            await Promise.all([transferPlatform, transferSeller]);

            res.status(200).json({
                message: "transfer completed successfully",
                status: "successful"
            });

        } catch (error) {
            res.status(500).json({
                message: error?.message,
                status: "internal error"
            });
        }

    },
    checkStatusPaymentIntent: async (req, res) => {

        try {
            const { paymentIntentId } = req.query;

            const paymentIntent = await stripeUseCases.checkStatusPaymentIntent(paymentIntentId)

            const statusPaymentIntent = paymentIntent.status;

            res.status(200).json({
                message: "check succeesful",
                status: statusPaymentIntent
            });

        } catch (error) {

            res.status(500).json({
                message: error.type,
                status: "internal error"
            });

        }

    }
}
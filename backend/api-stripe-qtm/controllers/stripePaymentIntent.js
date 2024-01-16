require('dotenv').config()
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const convertAmountInCents = require("../utils/convertAmountInCents")

module.exports = {
    confirmPaymentIntent: async (req, res) => {

        const { paymentIntentId } = req.query;

        try {
            const paymentIntent = await stripe.paymentIntents.confirm(
                paymentIntentId
            );

            const singleId = 'identificador_unico'; // id referente a consulta

            await stripe.paymentIntents.update(paymentIntent.id, {
                metadata: {
                    transfer_group: singleId,
                },
            });

            return res.status(200).json({
                message: "Payment Confimerd",
                paymentIntentId: paymentIntent.id
            });

        } catch (error) {
            console.log(error?.message);
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
            const paymentIntent = await stripe.paymentIntents.create({
                amount: convertAmountInCents(amount),
                currency: countryPayment,
                automatic_payment_methods: {
                    enabled: true,
                    allow_redirects: "never"
                },
                payment_method_data: {
                    "type": "card",
                    "card[token]": req.tokenCard
                },
                description: "consulta marcada", // Adicione uma descrição conforme necessário
                receipt_email: email,
            });

            responsePayment = {
                status: 201,
                message: "Successful created payment intent!",
                paymentDetails: {
                    paymentId: paymentIntent.id
                }
            }

            return res.status(201).json(responsePayment);

        } catch (error) {
            console.log(error.hasOwnProperty("message") && error.message);
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
            const retrievedPaymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

            const sellerPaymentPercent = 0.8 * retrievedPaymentIntent.amount;
            const platformPaymentPercent = 0.2 * retrievedPaymentIntent.amount;

            // transferencia para o terapeuta
            const transferSeller = stripe.transfers.create({
                amount: sellerPaymentPercent, // Value in cents
                currency: countryCode,
                destination: connectedAccountSellerId,
                transfer_group: retrievedPaymentIntent.metadata.transfer_group,
                source_transaction: retrievedPaymentIntent.latest_charge
            });

            // transferencia para a plataforma (QTM)
            const transferPlatform = stripe.transfers.create({
                amount: platformPaymentPercent, // Value in cents
                currency: countryCode,
                destination: process.env.PLATFORM_ACCOUNT,
                transfer_group: retrievedPaymentIntent.metadata.transfer_group,
                source_transaction: retrievedPaymentIntent.latest_charge
            });

            const [transferSellerResponse, transferPlatformResponse] = await Promise.all([transferPlatform, transferSeller]);

            // Verificar o status da transferência
            // if (transferPlatform.status === 'succeeded' && transferSeller.status === 'succeeded') {
            //   res.status(200).json({ message: 'Transferência de fundos concluída com sucesso.' });
            // } else {
            //     res.status(400).json({ error: 'A transferência de fundos falhou.' });
            // }

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

            const paymentIntent = await stripe.paymentIntents.retrieve(
                paymentIntentId
            );

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
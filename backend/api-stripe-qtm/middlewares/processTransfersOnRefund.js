const stripeUseCases = require("../external/stripe")

const processTransfersOnRefund = async (req, res, next) => {

    const { connectedAccountSellerId } = req.body;

    const { amount, currency, latest_charge, metadata } = req.body.paymentDetails;

    const platformValue = 0.1*amount;
    const sellerValue = 0.3*amount;
    
    try {
        // transferencia para o terapeuta
        const transferSeller = await stripeUseCases.transferFunds({
            amount: sellerValue, // Value in cents
            currency: currency,
            destination: connectedAccountSellerId,
            transfer_group: metadata.transfer_group,
            source_transaction: latest_charge
        });

        // transferencia para a plataforma (QTM)
        const transferPlatform = await stripeUseCases.transferFunds({
            amount: platformValue, // Value in cents
            currency: currency,
            destination: process.env.PLATFORM_ACCOUNT,
            transfer_group: metadata.transfer_group,
            source_transaction: latest_charge
        });

        await Promise.all([transferSeller, transferPlatform]);

        next()

    } catch (error) {
        res.status(500).json({
            message: error.message,
            status: "failed"
        })
    }

}

module.exports = processTransfersOnRefund;
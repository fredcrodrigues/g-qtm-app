const stripeUseCases = require("../external/stripe")

module.exports = {
    createAccountConnected: async (req, res) => {

        const { email, countryCode, name } = req.body;

        try {
            const account = await stripeUseCases.createAccountConnected(countryCode, email, name)

            const accountLink = await stripeUseCases.createLinkForOnboarding(account.id)
            
            return res.status(200).json({
                message: "account creation started",
                status: "successful",
                responseAccount: accountLink
            });
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({
                message: error.type,
                status: "internal error"
            });
        }

    },
    deleteTest: async (req, res) =>{
        try {
            const deleted = await stripe.accounts.del(req.params.paymentId);

            res.status(200).json({
                status: "success",
                message: "account deleted"
            })
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: "internal error"
            })            
        }
    }
}
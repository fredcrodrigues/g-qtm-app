require('dotenv').config()
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = {
    validateCard: async (req, res) => {

        const { number, cvc, exp_month, exp_year } = req.body;

        try {
            const response = await stripe.tokens.create({
                card: {
                    number,
                    cvc,
                    exp_month,
                    exp_year
                }
            });
            
            return res.status(200).json({
                brand: response.card.brand,
                funding: response.card.funding,
                validate: true,
                message: "Successful!"
            });
        } catch (error) {
            console.log(error.hasOwnProperty("message") && error.message)
            return res.status(500).json({
                message: error.message,
                status: error.type,
                validate: false
            });
        }
    }
}
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = {
    createAccountConnected: async (req, res) => {

        const { email, countryCode, name } = req.body;

        try {
            const account = await stripe.accounts.create({
                type: 'express', // ou 'standard' ou 'custom'
                country: countryCode, // Código do país da conta
                email: email, // E-mail do vendedor
                capabilities: {
                    card_payments: { requested: true },
                    transfers: { requested: true },
                },
                business_type: "individual",
                business_profile: {
                    url: "https://qtmhealthtech.com.br/",
                    name: name//nome do terapeuta
                }
            });

            const accountLink = await stripe.accountLinks.create({
                account: account.id,
                refresh_url: 'https://www.google.com', // URL para redirecionar se o usuário fechar a janela de onboarding
                return_url: process.env.DEEP_LINK, // URL para redirecionar após o usuário concluir o onboarding
                type: 'account_onboarding',
            });
            
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

    }
}
require("dotenv").config()
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const convertAmountInCents = require("../utils/convertAmountInCents")

class StripeUseCases{
    _stripeInstance

    constructor(stripe){
        this._stripeInstance=stripe
    }

    async confirmPayment(paymentIntentId){
        const paymentIntent = await this._stripeInstance.paymentIntents.confirm(
            paymentIntentId
        );

        const singleId = ""

        await this._stripeInstance.paymentIntents.update(paymentIntent.id, {
            metadata: {
                transfer_group: singleId,
            },
        });

        return paymentIntent
    }

    async createPaymentIntent(amount, email, countryPayment, tokenCard){
        const paymentIntent = await this._stripeInstance.paymentIntents.create({
            amount: convertAmountInCents(amount),
            currency: countryPayment,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: "never"
            },
            payment_method_data: {
                "type": "card",
                "card[token]": tokenCard
            },
            description: "consulta marcada", // Adicione uma descrição conforme necessário
            receipt_email: email,
            capture_method: "manual"
        });

        return paymentIntent
    }

    async checkStatusPaymentIntent(paymentIntentId){
        const paymentIntent = await this._stripeInstance.paymentIntents.retrieve(
            paymentIntentId
        );
        return paymentIntent
    }

    async transferFunds(transferObj){
        const transfer = await this._stripeInstance.transfers.create(transferObj);
    }

    async createCardToken(card){
        const token = await this._stripeInstance.tokens.create({
            card
        });
        return token
    }

    async cancelPayment(paymentIntentId){
        const paymentIntent = await this._stripeInstance.paymentIntents.cancel(
            paymentIntentId
        );
        return paymentIntent
    }

    async createAccountConnected(countryCode, email, name){
        const account = await this._stripeInstance.accounts.create({
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
        return account
    }

    async createLinkForOnboarding(accountId){
        const accountLink = await this._stripeInstance.accountLinks.create({
            account: accountId,
            refresh_url: 'https://www.google.com', // URL para redirecionar se o usuário fechar a janela de onboarding
            return_url: process.env.DEEP_LINK, // URL para redirecionar após o usuário concluir o onboarding
            type: 'account_onboarding',
        });
        return accountLink
    }

    async refundPayment(charge, amount){
        const refund = await this._stripeInstance.refunds.create({
            charge,
            amount
        });
        return refund
    }
}

module.exports = new StripeUseCases(stripe)
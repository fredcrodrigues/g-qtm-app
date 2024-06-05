const request = require("supertest")
const server = require("../../server")

//config mock to stripe service
jest.mock('../../external/stripe')
const stripeService = require("../../external/stripe")

describe("Payment intent endpoints", () => {

    test("create payment intent", async () => {

        const cardTest = {
            number: "",
            exp_month: "",
            exp_year: "",
            cvc: ""
        }

        stripeService.createCardToken.mockResolvedValueOnce({id: ""})
        stripeService.createPaymentIntent.mockResolvedValueOnce({id: ""})

        const response = await request(server)
            .post("/create-payment-intent")
            .send({
                card: cardTest
            })

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty("paymentDetails")
    })

    test("confirm payment intent", async () => {

        stripeService.confirmPayment.mockResolvedValueOnce({ id: "single id" });

        const response = await request(server)
            .get("/confirm-payment-intent")

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("paymentIntentId")
        expect(response.body).toHaveProperty("message")
    })

    test("cancel payment intent", async () => {

        stripeService.cancelPayment.mockResolvedValueOnce({status: "canceled"})
        stripeService.checkStatusPaymentIntent.mockResolvedValueOnce({status: "undefined"})

        const response = await request(server)
            .get("/cancel-payment-intent")

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("status", "canceled")

    })

    test("refund payment", async () => {
        const body = {
            paymentIntentId: "",
            connectedAccountSellerId: ""
        }

        const paymentDetailsTest = {
            amount: 0, currency: "", latest_charge: "", metadata: {}
        }

        stripeService.checkStatusPaymentIntent.mockResolvedValueOnce({ status: "succeeded", ...paymentDetailsTest})
        stripeService.transferFunds.mockResolvedValueOnce({})
        stripeService.refundPayment.mockResolvedValueOnce({ status: "succeeded" })

        const response = await request(server)
            .post("/refund-payment")
            .send(body)

        expect(response.status).toBe(200)
    })

})
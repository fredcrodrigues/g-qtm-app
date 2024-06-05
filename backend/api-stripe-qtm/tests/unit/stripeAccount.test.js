const request = require("supertest")
const server = require("../../server")

//config mock to stripe service
jest.mock('../../external/stripe')
const stripeService = require("../../external/stripe")

describe("Account connected endpoints", () => {

    test("create connected account", async () => {

        const body = {
            countryCode: "BR",
            email: "xxx",
            name: "test"
        }

        stripeService.createAccountConnected.mockResolvedValueOnce({ id: "" })
        stripeService.createLinkForOnboarding.mockResolvedValueOnce({})

        const response = await request(server)
            .post("/create-account-connected")
            .send(body)
   
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("status", "successful")
    })

})
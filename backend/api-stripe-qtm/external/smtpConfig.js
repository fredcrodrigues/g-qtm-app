require("dotenv").config()

const configSMTP = {
    host: "smtp.gmail.com",
    user: process.env.USER,
    pass: process.env.PASS,
    port: 587
}

module.exports = configSMTP;
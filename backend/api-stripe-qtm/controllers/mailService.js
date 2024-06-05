const mailService = require("../external/nodemailer")

module.exports = {
    sendMailGeneralSupport: async (req, res) => {
        var emailContent = {
            ...req.body
        }

        const response = await mailService.sendGeneralMail(emailContent)

        if(response.status=="error"){
           return res.status(500).json(response)
        }

        res.status(200).json(response)
    },
    sendMailScheduleSupport: async (req, res) =>{

    }
}
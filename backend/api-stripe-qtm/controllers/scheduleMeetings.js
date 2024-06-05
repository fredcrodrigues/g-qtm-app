const scheduleMeetingUseCase = require("../external/googleMeet")

module.exports = {
    createScheduleMeeting: async (req, res) => {
        const { requestId } = req.body;

        const response = await scheduleMeetingUseCase.execute(requestId)

        if(response.status=="success"){
            return res.status(200).json(response)
        }
        res.status(500).json({message: "error"})
    }
}
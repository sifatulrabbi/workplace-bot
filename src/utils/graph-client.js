const axios = require("axios").default;

module.exports = (config) => {
    const module = {};

    module.graphClient = axios.create({
        baseURL: "https://graph.workplace.com",
        headers: {
            "Authorization": `Bearer ${config.ACCESS_TOKEN}`,
            "Content-Type": "application/json",
        },
    });

    //Send messages by using the Send API
    module.callSendAPI = async function (messageData) {
        try {
            await this.graphClient.post("/me/messages", messageData);
            console.log("Successfully sent a message");
        } catch (err) {
            console.error("Failed calling Send API", err.response);
        }
    };

    return module;
};

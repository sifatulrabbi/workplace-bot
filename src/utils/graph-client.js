const axios = require("axios").default;

module.exports = (config) => {
    const module = {};

    module.graphClient = axios.create({
        baseURL: "https://graph.facebook.com",
        headers: {
            "Authorization": `Bearer ${config.ACCESS_TOKEN}`,
            "Content-Type": "application/json",
        },
    });

    //Send messages by using the Send API
    module.callSendAPI = async function (messageData) {
        try {
            const res = await this.graphClient.post(
                "/me/messages",
                messageData,
            );
            const recipientId = res.data.recipient_id;
            const messageId = res.data.message_id;
            if (messageId)
                console.log(
                    "Successfully sent message with id %s to recipient %s",
                    messageId,
                    recipientId,
                );
            else
                console.log(
                    "Successfully called Send API for recipient %s",
                    recipientId,
                );
        } catch (err) {
            console.error("Failed calling Send API", err.response);
        }
    };

    return module;
};

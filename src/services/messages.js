const serviceAcc = require("../config/gcp_client_secret.json");

module.exports = (graphApi) => {
    const msgModule = {};

    /**
     * Get messages sent to the bot by the user
     * @param {import("express").Request} req
     */
    msgModule.getMessages = function (req) {
        const msgs = [],
            data = req.body;
        // Make sure this is a page subscription
        if (data.object === "page") {
            for (const pageEntry of data.entry) {
                for (const messagingEvent of pageEntry.messaging) {
                    if (messagingEvent.message) msgs.push(messagingEvent);
                }
            }
        }
        return msgs;
    };

    //Handle received message
    msgModule.handleMessage = async function (message) {
        const senderID = message.sender.id;
        // getting the message from the user
        const incoming_message = message.message.text;
        console.log(incoming_message);
        this.sendMessage(senderID, "Hello World");
    };

    //Send message from the bot to the user
    msgModule.sendMessage = function (recipientId, text) {
        let messageData = {
            recipient: {
                id: recipientId,
            },
            message: {
                text: text,
                metadata: "DEVELOPER_DEFINED_METADATA",
            },
        };
        graphApi.callSendAPI(messageData);
    };
    return msgModule;
};

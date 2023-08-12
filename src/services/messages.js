const serviceAcc = require("../config/gcp_client_secret.json");

module.exports = (graphApi) => {
    const msgModule = {};

    /**
     * Get messages sent to the bot by the user
     * @param {import("express").Request} req
     */
    msgModule.getMessages = function (req, responses) {
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

    /**
     * Handle received message
     * @param {{sender: {id: string}; message: {text: string}}} message
     * @param {Array<[key: string, value: string]>} responses
     */
    msgModule.handleMessage = async function (message, responses) {
        const senderID = message.sender.id;
        const incomingMsg = message.message.text;

        let reply = "No acronym found!";
        const match = responses.find((r) => r[0] === incomingMsg);
        if (match) reply = match[1];

        await this.sendMessage(senderID, reply);
    };

    //Send message from the bot to the user
    msgModule.sendMessage = async function (recipientId, text) {
        let messageData = {
            recipient: {
                id: recipientId,
            },
            message: {
                text: text,
                metadata: "DEVELOPER_DEFINED_METADATA",
            },
        };
        await graphApi.callSendAPI(messageData);
    };
    return msgModule;
};

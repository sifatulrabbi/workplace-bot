module.exports = (graphApi) => {
    const msgModule = {};

    /**
     * Get messages sent to the bot by the user
     * @param {import("express").Request} req
     */
    msgModule.getMessages = function (req) {
        const msgs = [],
            data = req.body;
        require("fs").writeFileSync("tmp/page.json", JSON.stringify(req.body));
        // Make sure this is a page subscription
        if (data.object === "page") {
            for (const pageEntry of data.entry) {
                if (!pageEntry.messaging) continue;
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
        const match = responses.find(
            (r) => r[0].toLowerCase() === incomingMsg.toLowerCase(),
        );
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

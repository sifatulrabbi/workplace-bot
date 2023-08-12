module.exports = (graphApi, config) => {
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
     * @param {{sender: {id: string}; message: {text: string; mid: string}}} msg
     * @param {Array<[key: string, value: string]>} responses
     */
    msgModule.handleMessage = async function (msg, responses) {
        const isThread = msg.thread && !!msg.thread.id;
        const recipientId = isThread ? msg.thread.id : msg.sender.id;
        const isMentioned =
            msg.mentions &&
            msg.mentions.length > 0 &&
            msg.message.text.includes(config.BOT_NAME);

        // if the bot wasn't mentioned the don't reply
        if (isThread && !isMentioned) return;

        // remove all the mention and bot names from the incoming msg
        const nameRgx = new RegExp(`@${config.BOT_NAME}`, "gi");
        const incomingMsg = msg.message.text.replace(nameRgx, "").trim();

        let reply = "No acronym found!";
        const match = responses.find(
            (r) => r[0].toLowerCase() === incomingMsg.toLowerCase(),
        );
        if (match) reply = match[1];
        // if the match is not present and the msg is from a grp then do not reply
        if (!match && isThread) return;
        // otherwise send a default reply
        await this.sendMessage(recipientId, reply, isThread);
    };

    //Send message from the bot to the user
    msgModule.sendMessage = async function (
        recipientId, // either user id or thread id
        text,
        isThread = false,
    ) {
        const messageData = {
            // ids: string[] // to send msg to a new chat grp
            // id: string // to send a personal msg
            // thread_key: string // to send message to a thread
            recipient: {},
            message_type: "RESPONSE",
            message: {
                text: text,
            },
        };
        if (isThread) messageData.recipient.thread_key = recipientId;
        else messageData.recipient.id = recipientId;

        await graphApi.callSendAPI(messageData);
    };
    return msgModule;
};

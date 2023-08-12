module.exports = function (crypto, config) {
    const module = {};

    //Signature checking function
    module.signCheck = function (req, res, buf) {
        const signature = req.headers["x-hub-signature"];
        if (!signature)
            throw new Error("Couldn't validate the request signature.");
        else {
            const elements = signature.split("=");
            const signatureHash = elements[1];
            const expectedHash = crypto
                .createHmac("sha1", config.APP_SECRET)
                .update(buf)
                .digest("hex");
            if (signatureHash !== expectedHash)
                throw new Error("Couldn't validate the request signature.");
        }
    };

    return module;
};

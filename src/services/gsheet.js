// const fs = require("fs").promises;
const path = require("path");
const process = require("process");
// const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");

// // If modifying these scopes, delete token.json.
// const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
// // The file token.json stores the user's access and refresh tokens, and is
// // created automatically when the authorization flow completes for the first
// // time.
// const TOKEN_PATH = path.join(process.cwd(), "src/config/token_secret.json");
// const CREDENTIALS_PATH = path.join(
//     process.cwd(),
//     "src/config/gcp_client_secret.json",
// );
const SERVICE_ACC_PATH = path.join(
    process.cwd(),
    "src/config/gcp_service_account_secret.json",
);

// /**
//  * Reads previously authorized credentials from the save file.
//  *
//  * @return {Promise<OAuth2Client|null>}
//  */
// async function loadSavedCredentialsIfExist() {
//     try {
//         const content = await fs.readFile(TOKEN_PATH);
//         const credentials = JSON.parse(content);
//         return google.auth.fromJSON(credentials);
//     } catch (err) {
//         return null;
//     }
// }

// /**
//  * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
//  *
//  * @param {OAuth2Client} client
//  * @return {Promise<void>}
//  */
// async function saveCredentials(client) {
//     const content = await fs.readFile(CREDENTIALS_PATH);
//     const keys = JSON.parse(content);
//     const key = keys.installed || keys.web;
//     const payload = JSON.stringify({
//         type: "authorized_user",
//         client_id: key.client_id,
//         client_secret: key.client_secret,
//         refresh_token: client.credentials.refresh_token,
//     });
//     await fs.writeFile(TOKEN_PATH, payload);
// }

// /**
//  * Load or request or authorization to call APIs.
//  *
//  */
// async function authorize() {
//     let client = await loadSavedCredentialsIfExist();
//     if (client) {
//         return client;
//     }
//     client = await authenticate({
//         scopes: SCOPES,
//         keyfilePath: CREDENTIALS_PATH,
//     });
//     if (client.credentials) {
//         await saveCredentials(client);
//     }
//     return client;
// }

// /**
//  * get sheet
//  * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
//  * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
//  */
// async function getSheet(auth) {
//     const sheets = google.sheets({ version: "v4", auth });
//     const res = await sheets.spreadsheets.values.get({
//         spreadsheetId: "1A6tXhoNNYnTc03OJ0lHhv69WQHJ5HwUwa8nq4Yffy_k",
//         range: "A1:b1100",
//     });
//     const rows = res.data.values;
//     if (!rows || rows.length === 0) {
//         console.log("No data found.");
//         return;
//     }
//     console.log("Name, Major:");
//     rows.forEach((row) => {
//         // Print columns A and E, which correspond to indices 0 and 4.
//         console.log(`${row[0]}, ${row[4]}`);
//     });
// }

const sauth = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACC_PATH,
    scopes: "https://www.googleapis.com/auth/spreadsheets.readonly",
});

/**
 * @returns {Promise<Array<[key: string, value: string]>>}
 */
const getSheetWithSAuth = async () => {
    try {
        const authClient = await sauth.getClient();
        const sheet = google.sheets({ version: "v4", auth: authClient });
        const res = await sheet.spreadsheets.values.get({
            spreadsheetId: "1PsFnQ7Sdrp0_0jNropgQ1nU9xwN_HLvWXw8YHmT39o4",
            range: "A1:b1100",
        });
        return res.data.values || [];
    } catch (err) {
        console.error(err.response || err);
        return [];
    }
};

module.exports = {
    // authorize,
    // getSheet,
    getSheetWithSAuth,
};

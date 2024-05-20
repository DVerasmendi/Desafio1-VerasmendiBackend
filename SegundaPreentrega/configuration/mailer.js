const nodemailer = require('nodemailer');
const { google } = require('googleapis');
require('dotenv').config();

// Definir la función asincrónica createTransporter
async function createTransporter() {
    const OAuth2 = google.auth.OAuth2;
    const oauth2Client = new OAuth2(
        process.env.OAUTH_CLIENTID,       // ClientID
        process.env.OAUTH_CLIENT_SECRET,  // Client Secret
        "https://developers.google.com/oauthplayground"  // Redirect URL
    );

    oauth2Client.setCredentials({
        refresh_token: process.env.OAUTH_REFRESH_TOKEN
    });

    const accessToken = await oauth2Client.getAccessToken();

    console.log('Access Token:', accessToken);  

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.GMAIL_USER,
            clientId: process.env.OAUTH_CLIENTID,
            clientSecret: process.env.OAUTH_CLIENT_SECRET,
            refreshToken: process.env.OAUTH_REFRESH_TOKEN,
            accessToken: accessToken.token  
        }
    });

    return transporter;
}

module.exports = { createTransporter };

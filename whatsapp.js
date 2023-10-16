const twilio = require('twilio');
const express = require('express');
const bodyParser = require('body-parser');

const accountSid = 'ACad4982304550f6389a43adff302ff771'; // Obtain from your Twilio account
const authToken = '644348d5644b5bc349a5aa464711963a';   // Obtain from your Twilio account

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
const twilioPhoneNumber = 'whatsapp:+12512573846';  // Replace with your Twilio WhatsApp number

const client = twilio(accountSid, authToken);

app.post('/webhook', (req, res) => {
   // const {Body} = req.body;
    //const response = `Thank you for your message: ${Body}`;
    client.messages
        .create({
            body: 'Your appointment is coming up on July 21 at 3PM',
            from: 'whatsapp:+14155238886',
            to: 'whatsapp:+917678491455'
        })
        .then(() => {
            console.log('Response sent successfully');
            res.status(200).send('Response sent successfully');
        })
        .catch(error => {
            console.error('Error sending response:', error);
            res.status(500).send('Error sending response');
        });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

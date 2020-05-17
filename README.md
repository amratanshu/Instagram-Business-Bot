# instagram-business-Bot

(incomplete currently)

Instagram Bot for automating things - 
1. Replying to @mentioned comments as soon as the notification comes
2. Using Ngrok for tunneling HTTP requests to implement Facebook Webhooks
3. Using Instagram Graph API - works only on Instagram Business Accounts connected to a Facebook Page
4. Using Facebook Developer App for ClientID and ClientSecret to generate access tokens after oauth2.0

Note - Webhooks cannot be tested on real actions until the Facebook app is in Dev mode, Needs app review for Live Mode.

Done - 
1. Webhooks set up, using Dashboard App Test requests
2. Facebook Login, Access Tokens, PageIDs, Instagram IDs - Auth complete

Todo - 
1. Apply for App review
2. Implement Commenting back after webhook is hit
3. Change to Heroku for deploying as Ngrok changes the URL on each server set up, Ngrok URL to be subscribed each time at Fb Dev App Dashboard 

Partial Testing for devs - 
node index.js (after installing all the dependencies)

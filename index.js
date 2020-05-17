const ngrok = require("ngrok");
const express = require("express");
const fetch = require("node-fetch");
const app = express();
const bodyParser = require("body-parser");
const axios = require("axios");
const CLIENTID = "371168220496603";
const CLIENTSECRET = "f65adbfe55528dd87842511d46821ad1";

const { url, URLSearchParams } = require("url");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());
//app.use(express.static(__dirname + "/public")); //serves all filese in the public folder
var ACCESS_TOKEN;
var PAGEID;
var IGID;

app.get("/", (req, res) => {
  res.redirect(
    "https://www.facebook.com/dialog/oauth?response_type=code&state=&client_id=371168220496603&scope=instagram_manage_insights%20pages_manage_ads%20pages_manage_metadata%20pages_read_engagement%20pages_read_user_content%20instagram_basic%20instagram_manage_comments%20pages_show_list%20&redirect_uri=http://localhost:3000/login/redirect"
  );
  console.log("Root URL hit, proceeding to Login page\n\n");
  //res.redirect("/public/index.html");
});
//var url;
var params;

const redirectURI = "http://localhost:3000/login/redirect";
//&redirect_uri=${"http://localhost:3000/login/redirect"}

app.get("/login/redirect", (req, res) => {
  const requestToken = req.query.code; //code from the URl
  console.log(`requestToken is ${requestToken}\n`);
  //using axios to make a POST request to get back the access_token
  axios({
    method: "get", //GET request  - facebook documentation
    url: `https://graph.facebook.com/v7.0/oauth/access_token?client_id=${CLIENTID}&redirect_uri=${redirectURI}&client_secret=${CLIENTSECRET}&code=${requestToken}`,
    // Set the content type header, so that we get the response in JSOn
    headers: {
      accept: "application/json",
    },
  }).then((response) => {
    ACCESS_TOKEN = response.data.access_token;
    // redirect the user to the welcome page, along with the access token
    console.log("(short-lived) Access Token was successfully received.\n");
    console.log(`Access token is ${ACCESS_TOKEN}\n`);
    //console.log(response);

    res.redirect("/pageid");
  });
});

app.get("/pageid", (req, res) => {
  //GET Page IDs, Let's use node-fetch instead of axios now :)
  console.log("Fetching Page ID now\n");
  //const url = new URL("https://graph.facebook.com/v7.0/me/accounts");
  //params = new URLSearchParams({ access_token: ACCESS_TOKEN });
  // fetch(url + params)
  //   .then((res) => res.json())
  //   .then((json) => {
  //     console.log(json);
  //     //PAGEID = json.data.id;
  //     console.log(`PAGEID is ${PAGEID}`);
  //   });

  fetch(
    `https://graph.facebook.com/v7.0/me/accounts?access_token=${ACCESS_TOKEN}`
  )
    .then((res) => res.json())
    .then((json) => {
      //console.log(json);
      PAGEID = json.data[0].id;
      console.log(`PAGEID is ${PAGEID}`);
      res.redirect("/pageid/igid");
    });
});

app.get("/pageid/igid", (req, res) => {
  //console.log("Hitting /pageid/igid");
  console.log("Fetching IGID now\n");

  fetch(
    `https://graph.facebook.com/v7.0/${PAGEID}?fields=instagram_business_account&access_token=${ACCESS_TOKEN}`
  )
    .then((res) => res.json())
    .then((json) => {
      //console.log(json);
      IGID = json.instagram_business_account.id;
      res.redirect("/success");
    });
});

app.get("/success", (req, res) => {
  console.log("Hitting /success endpoint : Listening to Webhooks.\n");
  res.send("Everything is set up now, waiting for webhooks!\n");
});

app.get("/webhooks", (req, res) => {
  //console.log(req.query.hub);
  //verifying the TOKEN
  if (req.query["hub.verify_token"] === "customVerifyToken")
    res.send(req.query["hub.challenge"]);
});

app.post("/webhooks", (req, res) => {
  //verify sha1 (optional though) todo
  console.log("A webhook was hit!\n");
  console.log(req.body);
  res.sendStatus(200);
});

const server = app.listen(3000, () => {
  ngrok.connect(3000).then((ngrokUrl) => {
    endPoint = ngrokUrl;
    console.log(`Login Service running, open at ${endPoint}`);
  });
});

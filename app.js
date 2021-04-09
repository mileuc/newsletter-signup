require('dotenv').config();
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post('/', function(req, res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const emailAddress = req.body.email;

    const data = {
        members: [
            {
                email_address: emailAddress,
                status: "subscribed", 
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = `https://us7.api.mailchimp.com/3.0/lists/${process.env.LIST_ID}`;
    const options = {
        method: "POST",
        auth: `mile:${process.env.API_KEY}`
    };

    const request = https.request(url, options, function(response) {
        response.on("data", function(data) {
            if (response.statusCode === 200) {
                res.sendFile(__dirname + "/success.html");
            }
            else {
                res.sendFile(__dirname + "/failure.html");
            }

            console.log(JSON.parse(data));  
        });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res) {
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running on port 3000.");
});


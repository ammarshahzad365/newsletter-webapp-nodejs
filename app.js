//FROM MAILCHIMP
//mailchimp api key
//762d31cf3201165d99bf01b93bb01a92-us21
//list id
//3990cd3e10

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");


const port = 3000;

const app = express();

app.use(bodyParser.urlencoded({extended: true})); //use body parser
app.use(express.static("public")); //folder "public" containing images and css can be used inside the server now


app.get("/", function(req, res){ //when user asks to get to home route
    res.sendFile(__dirname + "/signup.html"); //send the signup.html file
})

app.post("/", function(req, res){ //when there is a post request on home route
    
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;

    var data = { //mailchimp accepts data of audience members in this format
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    var JSONdata = JSON.stringify(data); //convert data to json format for mailchimp

    var url = "https://us21.api.mailchimp.com/3.0/lists/3990cd3e10" //3990cd3e10: our list id from mailchimp AND us21: last digits of api key for our dedicated server

    const options = {
        method: "POST",
        auth: "ammarS:762d31cf3201165d99bf01b93bb01a92-us21" //username(any string): password(api key) for authentication
    }

    const request = https.request(url, options, function(response){ //we want to post our data to this url but unlike https.get (in weather app), there is no https.post so we use request
        
        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }
        
        response.on("data", function(data){ //on recieving data as response from mailchimp server: 
            console.log(JSON.parse(data));
        })
    });

    request.write(JSONdata); //now we send json data to the mailchimp server
    request.end(); //end request when we have stopped sending data

});

app.post("/failure", function(req, res){ //when there is a post request on /failure route (when try again is pressed)
    res.redirect("/"); //redirect to home route
})

app.listen(process.env.PORT || port, function(){
    console.log("Server is running on port 3000");
})



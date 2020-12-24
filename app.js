const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");
});

app.post("/",function(req,res){
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const emailUser = req.body.email;

    const data = {
        members : [
            {
                email_address : emailUser,
                status : "subscribed",
                merge_fields : {
                    FNAME : firstName   ,
                    LNAME : lastName
                }
            }
        ]
    };
const jsonData = JSON.stringify(data);

const url = "url";
const options = {
    method : "POST",
    auth : "authkey"
}
const request = https.request(url,options,function(response){
  if(response.statusCode == 200)
  {
    res.sendFile(__dirname+"/public/success.html");
  }
  else{
    res.sendFile(__dirname+"/public/failure.html");
  }
    response.on("data",function(data){
      console.log(JSON.parse(data));
  })
})

request.write(jsonData);
request.end();
})
app.listen(3000,function(){
    console.log("Server started on 3000");
});


//82173a2324094c8847b5aeab29baaae4-us2

//87335678a1

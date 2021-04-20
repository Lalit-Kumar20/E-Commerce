require('dotenv').config();
const express = require('express');
let alert = require('alert');  

const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const multer = require("multer");
const path = require("path");
const popup = require('node-popup');
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}));
// here connect to mongodb 
const products = {
    price : String,
    title : String,
    description : String,
    date : String,
    imagename : String
};
const temp = mongoose.model("product",products);
var storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"public");
    },
    filename:function(req,file,cb){
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})

var upload = multer({
    storage : storage
}).single('file');



app.get('/',function(req,res){
    temp.find({},function(err,foundItems){
        res.render("newhome",{
            her : foundItems 
        });    
    });
});
app.get('/signin',function(req,res){
    
    res.render("signin");
});
app.post('/signin',function(req,res){
   const name = req.body.username;
   const pass = req.body.password;
   if(!name || !pass)
   {
       res.redirect("/signin");
   }
   if(name===process.env.ADMIN  && pass===process.env.PASS)
   {
    /*temp.find({},function(err,foundItems){
        res.render("root",{
            her : foundItems
        });    
    });
    */

   res.redirect("/"+name);
   app.get("/"+name,function(req,res){
      temp.find({},function(err,foundItems){
          res.render("root",{
              her : foundItems,
          });    
      });
    });
   }
   else {
    const username = req.body.username;
    const password = req.body.password;
    if(username==="root" && password==="maihudon")
    {temp.find({},function(err,foundItems){
        res.render("root",{
            her : foundItems,
            user : req.body.username
        });    
    });
    }
    User.findOne({email : username},function(err,foundUser){
        if(foundUser===null)
        {
            res.redirect("/signin");
        }
        else {
            if(foundUser.password === password)
            {
                /*temp.find({},function(err,foundItems){
                    res.render("userpage",{
                        her : foundItems,
                        user : username
                    });    
                });
             */
            const uu = username+password;
              res.redirect("/"+uu);
             app.get("/"+uu,function(req,res){
                temp.find({},function(err,foundItems){
            
                    res.render("userpage",{
                        her : foundItems,
                        user : username,
                        pass : password
                    });    
                });
                
            })
            }
            else {
               
                res.redirect("/signin");
            }
        }
    });
   }
});
app.get('/signup',function(req,res){
    res.render("signup");
});
app.post("/root",upload,function(req,res){
       const user = req.body.user;
    const t1 = new temp({
        price : req.body.price,
        title: req.body.title,
        description: req.body.description,
        date : req.body.date,
        imagename:req.file.filename
       });
       t1.save();
      const na = "root";
      res.redirect("/"+na);
});

app.post('/rootdelete',function(req,res){
   var check = "aaaa";
   if(Object.keys(req.body).length === 0)
   {
       const names = "root";
       res.redirect("/"+names);
     console.log("abcdef");  
   }
   if(typeof req.body.items === typeof check && Object.keys(req.body).length !== 0) 
   {
    var input = req.body.items;
    
    var fields = input.split('~');
        var name = fields[0];
       var user = fields[1]; 
       temp.deleteOne({title : name},function(err){});
       
       const names = "root";
       res.redirect("/"+names);
}
   else if(typeof req.body.items !== typeof check && Object.keys(req.body).length !== 0){
    var len = req.body.items.length;
   var uu = "";
    for(i = 0; i < len; i++){
      var input = req.body.items[i];
     
    var fields = input.split('~');
        var name = fields[0];
       var user = fields[1]; 
      uu = user;
      temp.deleteOne({title : name},function(err){});
     
      
  }
  const names = "root";
       res.redirect("/"+names);
   }
});
app.post("/deletemessage",function(req,res){
    console.log(typeof req.body);
    console.log(req.body);
    console.log(Object.keys(req.body).length);
    if(Object.keys(req.body).length === 0)
  {
      console.log("abcdef");
      res.redirect("/m");    
      
     
  }
var check = "aaa";
if(typeof req.body.items === typeof check && Object.keys(req.body).length !== 0)
{
    var fields = req.body.items.split('~');
    var email = fields[0];
    var items = fields[1];
    var price = fields[2];
   Message.deleteOne({email : email,items : items,price : price},function(err){});
   Message.find({},function(err,found){
    res.render("messages",{
        her : found
    });    
});

}
else if(Object.keys(req.body).length !== 0 && typeof req.body.items !== typeof check){
    var len = req.body.items.length;
     for(i = 0; i < len; i++){
       var input = req.body.items[i];
      
     var fields = input.split('~');
         var email = fields[0];
        var items = fields[1]; 
       var price  = fields[2];
       Message.deleteOne({email : email,items : items,price : price},function(err){});
      
       
   }
   /*
   Message.find({},function(err,found){
    res.render("messages",{
        her : found
    });    
});
*/

res.redirect("/m");    
}

});
app.post('/tt',function(req,res){
 
    if(Object.keys(req.body).length === 1)
  {
      console.log("abcdef");
      var fl = req.body.val.split('+');
      var us = fl[0];
      var ps = fl[1];
      const f = us+ps;
      res.redirect("/"+f);
      
     
  }
    var names = "";
    var sum = 0;
    var check = "aaa";
    var u = "";
    if(typeof req.body.items===typeof check && Object.keys(req.body).length !== 1)
  {
    var input = req.body.items;
    
    var fields = input.split('~');
        var name = fields[0];
       var price = fields[1];
       var user = fields[2];
       u = user; 
      if(price) sum+=parseInt(price);
       if(name) names+=name;
       names+=','; 
       console.log(sum); 
  }
  else if(typeof req.body.items!==typeof check && Object.keys(req.body).length !== 1){

  
  var len = req.body.items.length;
  
  for(i = 0; i < len; i++){
    var input = req.body.items[i];
    
    var fields = input.split('~');
        var name = fields[0];
       var price = fields[1];
       var user = fields[2];
      console.log(price);
       u = user; 
      if(price) sum+=parseInt(price);
       if(name) names+=name;
       names+=',';
}
  }
  if(Object.keys(req.body).length !== 1){

   var newNames = names.slice(0,-1);
    var p = req.body.val;
    var pp = p.split('+');
    var pass = pp[1];    
    res.render('buyconfirm',{
        price : sum,
        items : newNames,
        user : u,
        pass : pass
    })
  }
})
app.post("/bb",function(req,res){

    const tt = req.body.val;
    var f = tt.split('+');
    var user = f[0]+f[1];
    res.redirect("/"+user);

});
app.post("/next",function(req,res){

    var input = req.body.val;
    var fields = input.split('~');
    var email = fields[0];
    var items = fields[1];
    var price = fields[2];
    var pass = fields[3];
    const newmessage =  new Message({
     email : email,
     items : items,
     price : price
    });

    newmessage.save(function(err){
        if(err) console.log(err);
        else console.log("Successfully saved");
    });
   
    res.render("ordered",{
       user : email,
       pass : pass
    });



});
app.post("/Contact",function(req,res){
   res.render("contact");
});
app.post('/backtosignin',function(req,res){
    temp.find({},function(err,foundItems){
        res.render("userpage",{
            her : foundItems,
            user : req.body.val
        });    
    });

});
app.post('/temp',function(req,res){
console.log(req.body.price);
});
app.get('/exit',function(req,res){
    
    res.redirect("/")
});

app.get("/m",function(req,res){
    Message.find({},function(err,found){
        res.render("messages",{
            her : found
        });    
    });
});
app.get("/backroot",function(req,res){
    const nn = "root";
   res.redirect("/"+nn);
    // temp.find({},function(err,foundItems){
     //   res.render("root",{
       //     her : foundItems
       // });
          
    //});
});
const userSchema = {
    email : String,
    password : String
};

const messageSchema = {
  email: String,
  items : String,
  price : String
};
const Message = new mongoose.model("Message",messageSchema);

const User = new mongoose.model("User",userSchema);
var flag = "aa";

app.post("/signup",function(req,res){

    const newUser = new User({
        email : req.body.username,
        password : req.body.password
    });
    
    User.findOne({email : req.body.username},function(err,foundItems)
    {
        if(foundItems!=null)
        {
            
            res.redirect("/signup");
        }
        else {
            newUser.save(function(err){
                if(err)
                {
                    console.log(err);
                }
                else {
                    const user = req.body.username;
                    const pass = req.body.password;
                    const tttt = user+pass;
                    res.redirect("/"+tttt);
                    app.get("/"+tttt,function(req,res){
                       temp.find({},function(err,foundItems){
                               res.render("userpage",{
                               her : foundItems,
                               user : user,
                               pass : pass
                           });    
                       });
                       
                   })
                }
            });
        
        
        }
    });
    

});
  























let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}





app.listen(port, function() {
    console.log("Server has started successfully");
  });
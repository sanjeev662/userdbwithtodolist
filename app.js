const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const { getDate } = require("./date");
const date = require(__dirname + "/date.js");

const app = express();
const port=process.env.PORT || 4500;

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

const connection=mongoose.connect("mongodb+srv://admin:admin123@ieltscluster.ahxku.mongodb.net/userdb",{useNewUrlParser:true});

const itemsSchema={   
    name:String,
    gender:String,
    age:String,
    password:String,
    money:Number,
    email:String,
    address:String
  };
  
  const Itema=new mongoose.model("Itema",itemsSchema);
  
  const item1=new Itema({
    "name": "sanjeev",
    "gender":"male",
    "age":"20",
    "password":"sanjeev",
    "money":345,
    "email": "sks@gmail.com",
    "address":"abc defghi"
  });
  
  const item2=new Itema({ 
    "name": "sanju",
    "gender":"male",
    "age":"22",
    "password":"sanju",
    "money":678,
    "email": "ss@gmail.com",
    "address":"abcddef"
  });
  
  const defaultItems=[item1,item2];

//for adding two default user data

app.get("/users",function(req,res)
{
Itema.find({},function(err,foundItems){

  if(foundItems.length==0){
    Itema.insertMany(defaultItems,function(err){
      if(err){
        console.log(err);
      }else{
        console.log("Succesfully saved default items to DB.");
      }
    });
    res.redirect("/users");
  }
  else{
    res.render("users",{customer:foundItems});
  }
  });
});

//for adding new user data

app.post("/register",function(req,res)
{  
  const item=new Itema({
    name:req.body.uname,
    gender:req.body.ugender,
    age:req.body.uage,
    password:req.body.psw,
    money:req.body.umoney,
    email:req.body.uemail,
    address:req.body.uaddress
  });
  item.save();
  console.log("Successfully added."); 
  res.redirect("/users"); 
});

//for deleting user data/account

app.post("/delete",function(req,res){
    const checkedItemId=req.body.checkbox;
  
    Itema.findByIdAndRemove(checkedItemId,function(err){
      if(!err){
        console.log("Successfully deleted checked item.");
        res.redirect("/users");
      }
    });
  });

//for login authentication of user

  app.post("/login",async(req,res) =>{
  
    try{
    const username=req.body.uname;
    const password=req.body.psw;
    
    const detail=await Itema.findOne({name:username});
  
      if(detail.password===password){
        
        res.status(201).render("customer",{customer:detail});
      }
      else{
        res.send("password are not matching");
      }
    }
      catch (error) {
        res.status(400).send("error")
      }
    
  })

  //from here all about todolist...

  const itemsSchemaa={   
    name:String
  };

  const Itemaa=mongoose.model("Itemaa",itemsSchemaa);

  const item1a=new Itemaa({
    name: "Welcome to your toDoList!"
  });
  const item2a=new Itemaa({ 
    name:"Lets start"
  });
  const defaultItemsa=[item1a,item2a];

  //for adding default item to todo list

  app.get("/lists",function(req,res)
  {
  Itemaa.find({},function(err,foundItemsa){

    var day=getDate();

    if(foundItemsa.length==0){
      Itemaa.insertMany(defaultItemsa,function(err){
        if(err){
          console.log(err);
        }else{
          console.log("Succesfully saved default items to DB.");
        }
      });
      res.redirect("/lists");
    }
    else{
      res.render("lists",{listTitle:day,newListItems:foundItemsa});
    }
    });
  });

  //for adding from input into todo list

  app.post("/lists",function(req,res)
  {
    const itemName=req.body.newItem;
    
    const item=new Itemaa({
      name:itemName
    });
    item.save();
    console.log("Successfully added."); 
    res.redirect("/lists"); 
  });

  //for deleting from db from todo list

  app.post("/remove",function(req,res){
    const checkedItemId=req.body.checkbox;

    Itemaa.findByIdAndRemove(checkedItemId,function(err){
      if(!err){
        console.log("Successfully deleted checked item.");
        res.redirect("/lists");
      }
    });
  });

  
//roughly flow of data :
//home >> login user >> with authentication >> user account detail
//home >> see users >> view users detail >> can delete or add user account 
//home >> todolist >> can add work data >> can remove work data


  app.get("/",function(req,res)
  {
    res.render("home");
  })

  app.get("/login",function(req,res)
  {
    res.render("login");
  })

  app.get("/register",function(req,res)
  {
     res.render("register");
  })

  app.get("/customer",function(req,res)
  {
  res.render("customer");
  })

  app.get("/deposite",function(req,res)
  {
  res.render("deposite");
  })

app.listen(port, function(){
    console.log("Server started successfully..");
  });
//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require('mongoose');
const _= require('lodash');









mongoose.connect('mongodb+srv://admin-ibrahim:ibrahimisawesome321@ibrahimdb.jnyonsa.mongodb.net/?retryWrites=true&w=majority');
 



const itemSchema = new mongoose.Schema({
    name: String
});

const listSchema = new mongoose.Schema({
  name:String,
  items: [itemSchema]
});

const workListItem = mongoose.model('workListItem', itemSchema);
const generalListItem = mongoose.model('generalListItem', itemSchema);
const item = mongoose.model('item', itemSchema);
const list = mongoose.model("list", listSchema);


   

const app = express();

app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];
var action ;
var action2 ;
const workList = "/work";

app.get("/", function(req, res) {
action = "/";
action2 = "/delete" ;
const day = date.getDate();
generalListItem.find({}, function(err,generalListItems){
  res.render("list", {day: day, items: generalListItems, action:action, action2:action2});
});
});

app.post("/", function(req, res){

  const novelItem = new generalListItem({name:req.body.newItem});
  novelItem.save();
    res.redirect("/");

});


app.post("/work", function(req, res){

  const novelItem = new workListItem({name:req.body.newItem});
  novelItem.save();
  
  
    res.redirect("/work");

});

app.post("/delete", function(req, res){

  generalListItem.deleteOne({ _id: req.body.checkbox }, function (err) {
    if (err) return handleError(err);
  });
    res.redirect("/");

});

app.get("/work", function(req,res){
  action="/work";
  action2="/deleteWork" ;
  
  workListItem.find({},function(err, workListItems){
  
  res.render("list", {day: "Work List", items: workListItems, action:action, action2:action2});
});
});

app.post("/deleteWork", function(req, res){

  workListItem.deleteOne({ _id: req.body.checkbox }, function (err) {
    if (err) return handleError(err);
  });
  
    res.redirect("/work");

});
app.get("/about", function(req, res){
  res.render("about");
});

app.get("/n/:list", function(req, res){
  const listURL = _.capitalize(req.params.list);
  action = "/n/";
  action2 = "/n/delete";
  
  list.findOne({name:listURL}, function (err, foundList) { 
    if (!err){
      if(!foundList){
        const thisList = new list({
          name:listURL
        });
        thisList.save();
        res.redirect("/n/"+listURL);
        /* console.log("not existent") */
      }else{
        res.render("list", {day: listURL, items: foundList.items, action:action, action2:action2}); 
        /* console.log("here and well") */
      }
    }
   });
       
    
        /* thisList.save(); */
   
 
});
app.post("/n/", function(req, res){
  const novelItem = new item({name:req.body.newItem});
  list.findOne({name:req.body.list}, function(err, foundList){
    if(!err){
      foundList.items.push(novelItem);
      foundList.save();
      res.redirect("/n/"+req.body.list);
    }else{
      console.log(err);
    }
  });

 
    

});

app.post("/n/delete", function(req, res){
  thisList = req.body.list;
  thisId = req.body.checkbox;
  list.findOneAndUpdate({name:thisList},{$pull:{items:{_id:thisId}}}, function(error, foundList){
    if(!error){
      res.redirect("/n/"+thisList);
      }
    
  })});
  
    



app.listen(3000, function() {
  console.log("Server started on port 3000");
});

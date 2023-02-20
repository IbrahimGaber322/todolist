//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require('mongoose');



mongoose.connect('mongodb://127.0.0.1:27017/todolist');

const listSchema = new mongoose.Schema({
    name: String
});

const workList = mongoose.model('workList', listSchema);
const generalList = mongoose.model('generalList', listSchema);
  

  

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];
var action ;

app.get("/", function(req, res) {
action = "/";
const day = date.getDate();

  res.render("list", {listTitle: day, newListItems: items, action:action});

});

app.post("/", function(req, res){

  const item = req.body.newItem;
    items.push(item);
    res.redirect("/");

});


app.post("/work", function(req, res){

  const item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");

});

app.get("/work", function(req,res){
  action="/work";
  res.render("list", {listTitle: "Work List", newListItems: workItems, action:action});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

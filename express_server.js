const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser')

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
const users = {
  '10000': {
    id: "10000", 
    email: "test", 
    password: "123"
  }
};

//located code: https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
const generateRandomString = (length) => {
  let result           = '';
  const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

app.set("view engine", "ejs"); //setting the view engine.

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  console.log(req.cookies['user_id']);
  const templateVars = {
    userID: req.cookies['user_id'],
    urls: urlDatabase
  }
  res.render("urls_index", templateVars);
});


app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  const shortURL = generateRandomString(7) //EVENTUALLY ADD FUNCTIONALITY THAT WILL CHECK IF The shortURL already exists,
  urlDatabase[shortURL] = req.body.longURL;
  console.log(shortURL, req.body.longURL)
  //res.send("Ok");         // Respond with 'Ok' (we will replace this)
  res.redirect(`/urls/${shortURL}`)
});

app.get("/urls/new", (req, res) => {
  const templateVars = { 
    userID: req.cookies['user_id'] };
  // const templateVars = { 
  //   username: req.cookies["username"] }
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], userID: req.cookies["user_id"] };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.post("/urls/:shortURL", (req, res) => {
  //console.log('logging:', req.body);
  console.log(req.body.editSubmit);
  urlDatabase[req.params.shortURL] = req.body.editSubmit
  res.redirect(`/urls`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls')
});


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.post("/login", (req, res) => {
  //res.cookie('username', req.body.username);
  res.cookie('user_id', req.body.userID)
  res.redirect('/urls');
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id', req.body.userID);
  res.redirect('/urls');
});

app.get("/register", (req, res) => {
  const templateVars = { 
    userID: req.cookies['user_id'] };
  res.render("register", templateVars);
});

app.get("/login", (req, res) => {
  const templateVars = { 
    userID: req.cookies['user_id'] };
  res.render("login", templateVars);
});

app.post("/register", (req, res) => {
  const randID = generateRandomString(10);
  users[randID] = { id: randID.toString(), username: req.body.username, password: req.body.password};
  res.cookie('user_id', randID);
  //res.cookie('username', req.body.username);
  res.redirect('/urls');
});

app.post("/login", (req, res) => {
  console.log("I entered the login page POST")
  //res.cookie('username', req.body.username);
  res.redirect('/urls');
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
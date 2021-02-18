const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
var cookieSession = require('cookie-session')
const bcrypt = require('bcrypt');
//const {getUserByEmail} = require('./helpers');


//
///// Middleware
//

app.use(bodyParser.urlencoded({extended: true}));
// app.use(cookieParser())
app.use(cookieSession({
  name: 'session',
  // Cookie Options
  keys: ['key1'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

//
///// Const Variable used for testing purposes.
//

const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: '10000' },
  "9sm5xK": { longURL: "http://www.google.com", userID: '10000'}
};

const users = {
  '10000': {
    id: "10000", 
    email: "test", 
    password: "123"
  }
};

//
///// Helper Functions
//

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

const checkEmailExists = (newEmail) => {
  for(let id in users){
    if (users[id].email === newEmail){
      return true;
    }
  }
  return false;
};

const loginAuth = (username, password) => {
  for (let id in users) {
    if (users[id].email === username){
      if(bcrypt.compareSync(password, users[id].password)){
        return id;
      }
    }
  }
  return false;
}

const userAuthorized = (user, shortURL) => {
  const accessibleURLS = urlsForUser(user);
  for (let urlID in accessibleURLS)
  {
    if (shortURL === urlID){
      return true;
    }
  }
  return false;
};

const urlsForUser = (id) => {
  let result = {};
  for (let urlID in urlDatabase){
    if (urlDatabase[urlID].userID === id) {
      result[urlID] = urlDatabase[urlID];
    }
  }
  return result;
}

const checkURL = (id) => {
  for (let urlID in urlDatabase){
    if (urlID === id) {
      return true;
    }
  }
  return false;
}

app.set("view engine", "ejs"); //setting the view engine.

app.get("/", (req, res) => {
  if(req.session.user_id){
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
});

//
///// GET and POST functions
//

app.get("/urls", (req, res) => {
  const templateVars = {
    userID: req.session.user_id,
    urls: urlsForUser(req.session.user_id),
    user: users[req.session.user_id],
  };
  if (!req.session.user_id) {
    res.redirect('/login');
  }
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString(7) 
  //ADD FUNCTIONALITY THAT WILL CHECK IF The shortURL already exists,
  urlDatabase[shortURL] = {longURL: req.body.longURL, userID: req.session.user_id}
  res.redirect(`/urls/${shortURL}`)
});

app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {
    res.redirect('/login');
  } else {
  const templateVars = { 
    userID: req.session.user_id,
    user: users[req.session.user_id]
   };
  res.render("urls_new", templateVars);
  }
});

app.get("/urls/:shortURL", (req, res) => {

  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    userID: req.session.user_id,
    user: users[req.session.user_id]
  };

  const test = checkURL(req.params.shortURL);
  const authorized = userAuthorized(req.session.user_id, req.params.shortURL)

  if(test && authorized) {
    console.log("rendering urls_show");
    res.render("urls_show", templateVars);
  } else {
    res.status(404).send({ error: "Resource not located or Unauthorized" });
  }
});

//edit function
app.post("/urls/:shortURL", (req, res) => {
  let newURL = req.body.editSubmit;
  if (newURL.substring(0, 7) !== 'http://' || newURL.substring(0, 8) !== 'https://')
  {
    newURL = 'http://' + newURL;
  }
  urlDatabase[req.params.shortURL].longURL = newURL;
  res.redirect(`/urls/${req.params.shortURL}`);
});

//Redirect the to long URL
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});


app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls')
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.post("/logout", (req, res) => {
  req.session = null
  res.redirect('/urls');
});

app.get("/register", (req, res) => {
  const templateVars = { 
    userID: req.session.user_id,
    user: users[req.session.user_id]
  };
  res.render("register", templateVars);
});

app.get("/login", (req, res) => {
  const templateVars = { 
    userID: req.session.user_id,
    user: users[req.session.user_id]
   };
  res.render("login", templateVars);
});

app.post("/register", (req, res) => {
  const randID = generateRandomString(10);
  if(!req.body.username || !req.body.password)
  {
    res.status(400).send({ error: "Username and Email must be values" });
  } else if (checkEmailExists(req.body.username)){
    res.status(400).send({ error: "Username already exists" });
  } else {
  users[randID] = { id: randID.toString(), email: req.body.username, password: bcrypt.hashSync(req.body.password, 10)};
  req.session.user_id = randID;
  res.redirect('/urls');
  }
});

app.post("/login", (req, res) => {
  const loginEmail = req.body.email;
  const loginPW = req.body.password;
  const ID = loginAuth(loginEmail,loginPW)
  if(ID)
  {
    req.session.user_id = ID;
    //res.cookie('user_id', ID);
    res.redirect('/urls');
  }
  else {
    res.status(403).send({ error: "Username and password combo don't exist" });
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
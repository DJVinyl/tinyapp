const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

//Requirements
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");

const bcrypt = require("bcryptjs"); // using bcryptJS
// bcrypt 5.0.0 is installed and works but due to errors mentioned in compass and
//by recommendation, bcryptjs is what is being used.

//Helper functions
const { generateRandomString } = require("./helpers");
const { checkEmailExists } = require("./helpers");
const { loginAuth } = require("./helpers");
const { userAuthorized } = require("./helpers");
const { urlsForUser } = require("./helpers");
const { checkURL } = require("./helpers");

//
///// Middleware
//
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "session",
    // Cookie Options
    keys: ["key1"],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

//
///// Database objects
//
const urlDatabase = {};
const users = {};

//What they look like and for testing purposes:
// const urlDatabase = {
//   'b2xVn2': { longURL: "http://www.lighthouselabs.ca", userID: test },
//   '9sm5xK': { longURL: "http://www.google.com", userID: test },
// };
//const user = {'tester': { email: 'test', password: '123' }};

//setting the view engine.
app.set("view engine", "ejs");

//Default
app.get("/", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

//
///// GET and POST functions
//
app.get("/urls", (req, res) => {
  const templateVars = {
    userID: req.session.user_id,
    urls: urlsForUser(req.session.user_id, urlDatabase),
    user: users[req.session.user_id],
  };
  if (!req.session.user_id) {
    res.redirect("/login");
  }
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString(7);
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: req.session.user_id,
  };
  res.redirect(`/urls/${shortURL}`);
});

app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/login");
  } else {
    const templateVars = {
      userID: req.session.user_id,
      user: users[req.session.user_id],
    };
    res.render("urls_new", templateVars);
  }
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    userID: req.session.user_id,
    user: users[req.session.user_id],
  };

  const test = checkURL(req.params.shortURL, urlDatabase);

  const authorized = userAuthorized(
    req.session.user_id,
    req.params.shortURL,
    urlDatabase
  );

  if (test && authorized) {
    res.render("urls_show", templateVars);
  } else {
    res.status(404).send({ error: "Resource not located or Unauthorized" });
  }
});

//edit function
app.post("/urls/:shortURL", (req, res) => {
  let newURL = req.body.editSubmit;
  urlDatabase[req.params.shortURL].longURL = newURL;
  res.redirect(`/urls/`);
});

//Redirect the to long URL
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL].longURL;
  if (!longURL.includes("http")) {
    longURL = "http://" + longURL;
  }
  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
  if (!req.session.user_id) {
    const templateVars = {
      userID: req.session.user_id,
      user: users[req.session.user_id],
    };
    res.render("register", templateVars);
  } else {
    res.redirect("/urls");
  }
});

app.get("/login", (req, res) => {
  if (!req.session.user_id) {
    const templateVars = {
      userID: req.session.user_id,
      user: users[req.session.user_id],
    };
    res.render("login", templateVars);
  } else {
    res.redirect("/urls");
  }
});

app.post("/register", (req, res) => {
  const randID = generateRandomString(10); // 10 character rand string
  if (!req.body.username || !req.body.password) {
    res.status(400).send({ error: "Username and Email must be values" });
  } else if (checkEmailExists(req.body.username, users)) {
    res.status(400).send({ error: "Username already exists" });
  } else {
    users[randID] = {
      id: randID.toString(),
      email: req.body.username,
      password: bcrypt.hashSync(req.body.password, 10),
    };
    req.session.user_id = randID;
    res.redirect("/urls");
  }
});

app.post("/login", (req, res) => {
  const loginEmail = req.body.email;
  const loginPW = req.body.password;
  const ID = loginAuth(loginEmail, loginPW, users);
  if (ID) {
    req.session.user_id = ID;
    //res.cookie('user_id', ID);
    res.redirect("/urls");
  } else {
    res.status(403).send({
      error:
        "Login Failed. Username and password combo don't exist. Or incorrect password.",
    });
  }
});

app.get("*", (req, res) => {
  res
    .status(404)
    .send({ error: "HEY, THIS PART OF THE WEBSITE DOESN'T EXIST YET!" });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

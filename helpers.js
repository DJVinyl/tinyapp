const bcrypt = require("bcryptjs");

//located code: https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
//
//// Generates a random string which takes an argument of length and returns a random string of that length
//
const generateRandomString = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

//
//// checks to see if someone is already registered with the email.
//
const checkEmailExists = (newEmail, usersDB) => {
  for (let id in usersDB) {
    if (usersDB[id].email === newEmail) {
      return true;
    }
  }
  return false;
};

//
//// Login Authenticator which checks username and password against DB
//
const loginAuth = (username, password, userDB) => {
  for (let id in userDB) {
    if (userDB[id].email === username) {
      if (bcrypt.compareSync(password, userDB[id].password)) {
        return id;
      }
    }
  }
  return false;
};

//
//// Checks to see if a user is authorized to be in accessing a shortURL. ShortURL may exist but may not be registered to the user. THis function retrns a boolean if the user does pertain to the shortURL.
//
const userAuthorized = (user, shortURL, urlDatabase) => {
  const accessibleURLS = urlsForUser(user, urlDatabase);
  for (let urlID in accessibleURLS) {
    if (shortURL === urlID) {
      return true;
    }
  }
  return false;
};
//
//// Returns an fraction database from the urlDatabase that pertains to the user's ID
//
const urlsForUser = (id, urlDatabase) => {
  let result = {};
  for (let urlID in urlDatabase) {
    if (urlDatabase[urlID].userID === id) {
      result[urlID] = urlDatabase[urlID];
    }
  }
  return result;
};
///
//// Checks to see if the shortID is indeed in the urlDatabase.
//
const checkURL = (id, urlDatabase) => {
  for (let urlID in urlDatabase) {
    if (urlID === id) {
      return true;
    }
  }
  return false;
};

//
/// Function given by compass. Used for mocha and Chai testing
//
const getUserByEmail = function (email, database) {
  let user = undefined;
  for (let id in database) {
    if (database[id].email === email) {
      user = database[id].id;
    }
  }
  return user;
};

module.exports = {
  getUserByEmail,
  generateRandomString,
  checkEmailExists,
  loginAuth,
  userAuthorized,
  urlsForUser,
  checkURL,
};

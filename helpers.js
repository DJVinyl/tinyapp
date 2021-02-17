const getUserByEmail = function(email, database) {
  let user = null;
  for(let id in database){
    if (database[id].email === email){
      user = database[id].email;
    }
  }
  return user;
};

module.exports = getUserByEmail;
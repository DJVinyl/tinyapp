const getUserByEmail = function(email, database) {
  let user = undefined;
  for(let id in database){
    if (database[id].email === email){
      user = database[id].id;
    }
  }
  return user;
};

module.exports = {getUserByEmail};
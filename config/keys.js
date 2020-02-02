module.exports = {
  mongoURI: "mongodb://"+process.env.MONGODB_USER+":"+process.env.MONGODB_PASSWORD+"@"+process.env.MONGODB_HOST+"/"+process.env.MONGODB_DATABASE,
  secretOrKey: "secret"
  };
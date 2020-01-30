module.exports = {
  mongoURI: "mongodb://"+process.env.MONGODB_USER+":"+process.env.MONGODB_PASSWORD+"@"+process.env.MONOGDB_HOST+"/"+process.env.MONGODB_DATABASE,
  secretOrKey: "secret"
  };
const LocalStrategy = require('passport-local').Strategy
//const bcrypt = require('bcrypt')

function initialize(passport, getUserByUsernamePromise) {
    const authenticateUser = (username, password, done) => {
        getUserByUsernamePromise(username).then((user) => {
 
          if (user == null) {
          console.log('No user with that username')
          return done(null, false, { message: 'No user with that username' })
        }

        if (password == user.password) {
          console.log('Signed In')
            return done(null, user)
        } else {
          console.log('incorrect password')
            return done(null, false, { message: 'Password incorrect' })
        }
      })
    }
    
  passport.use(new LocalStrategy({}, authenticateUser))
  
  passport.serializeUser((user, done) => {
    done(null, user.username)})
  passport.deserializeUser((username, done) => {
    
    getUserByUsernamePromise(username).then( (user) => {
      return done(null, user);
    })

  })
  
}

module.exports = initialize
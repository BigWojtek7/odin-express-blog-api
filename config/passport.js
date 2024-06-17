const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/user');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'Secret',
};

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(options, async (jwt_payload, done) => {
      console.log(jwt_payload);
      const user = await User.findById(jwt_payload.sub)
        // if (err) {
        //   return done(err, false);
        // }
      try {
        if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
      } catch(err){
        return done(err, false)
      }


    })
  );
};

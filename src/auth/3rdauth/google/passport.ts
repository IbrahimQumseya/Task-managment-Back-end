import * as passport from 'passport';
import { Profile } from 'passport-google-oauth20';

const GOOGLE_clientID =
  '579634652295-dtugto5edpbn5qckt95bttviqb5g7d3s.apps.googleusercontent.com';
const GOOGLE_clientSecret = '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';

const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_clientID,
      clientSecret: GOOGLE_clientSecret,
      callbackURL: 'http://localhost:3000/auth/google/callback',
    },
    function (accessToken, refreshToken, profile: Profile, cb) {
      cb(null, profile);
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

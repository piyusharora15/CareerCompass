import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import 'dotenv/config';

// These two blocks are REQUIRED by Passport, even for JWT flows
passport.serializeUser((data, done) => done(null, data));
passport.deserializeUser((data, done) => done(null, data));

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://careercompass-backend-3nf6.onrender.com/users/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        const email = profile.emails?.[0]?.value;

        if (!user) {
          if (!email) return done(new Error('No email found'), null);
          user = await User.findOne({ email });

          if (user) {
            user.googleId = profile.id;
          } else {
            const baseUsername = (profile.displayName || 'user').replace(/\s+/g, '').toLowerCase();
            let finalUsername = baseUsername;
            let suffix = 1;
            while (await User.exists({ username: finalUsername })) {
              finalUsername = `${baseUsername}${suffix++}`;
            }
            user = new User({ googleId: profile.id, username: finalUsername, email });
          }
          await user.save();
        }
        // Return the user object. Token will be created in the route.
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
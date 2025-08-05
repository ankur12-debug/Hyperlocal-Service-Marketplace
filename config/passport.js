//It's a configuration file which help the user to registration/login by Google;
import dotenv from 'dotenv';
dotenv.config();
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.BACKEND_URL}/api/auth/oauth/google/callback`
        },

        async (profile, done) => {
            try {
                let user = await User.findOne({email: profile.emails[0].value});//email: array of object whever the google responsed us back[{value:exmaple@gmail.com,varified:true}]--->to use the email only we use zeroth index(where the email is);
                if (!user) {
                    user = await User.create({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        password: 'oauth_placeholder',
                        role: 'user'
                    });
                }
                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                user.token = token;
                return done(null, user)//null says that there is no error occured while the time of execution;
            } catch (error) {
                return done(error, null)
            }
        }
    )
)
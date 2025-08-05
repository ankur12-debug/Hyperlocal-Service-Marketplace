//It's a authentication route which provider a route to user/provider for login/registration(manually or by google) 
import express from 'express';
import passport from 'passport';
import { register, login } from '../controller/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);


router.get(
  '/oauth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/oauth/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/login/failed',
  }),
  (req, res) => {
    res.status(200).json({
      message: 'OAuth login successful',
      token: req.user.token,
      name: req.user.name,
      email: req.user.email
    });
  }
);

export default router;
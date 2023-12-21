//users.js
import { log } from 'console';

import { Router } from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

//avatar
import gravatar from 'gravatar';
import normalizeUrl from 'normalize-url';

//validate
import { check, validationResult } from 'express-validator';
import { errorFormatter } from '../../utils/utils.js';

import auth from '../../middleware/auth.js';

import User from '../../model/User.js';
import { jwtSecret } from '../../config/keys.js';

const router = Router();

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post(
  '/register',
  check('name', 'Name is required').notEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check(
    'password',
    'Please enter a password with 6 or more characters'
  ).isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter);

    if (!errors.isEmpty()) {
      return res.status(400).json(Object.fromEntries(errors.array()));
    }

    const { name, password, email } = req.body;
    try {
      const dupUser = await User.findOne({ email });
      if (dupUser)
        return res.status(400).send({ email: 'User already exists' });

      let avatar = normalizeUrl(
        gravatar.url(email, { s: 200, r: 'pg', d: 'identicon' }),
        { forceHttps: true }
      );

      const salt = await bcryptjs.genSalt(10); //15
      const hash = await bcryptjs.hash(password, salt);

      const user = new User({
        name,
        email,
        password: hash,
        avatar,
      });

      await user.save();


      res.sendStatus(200);

    } catch (err) {


      let msg = 'Server error';



      res.status(500).send({ Error: msg });
    }
  }
);

// @route   POST api/users/login
// @desc    Login user / JWT Returning Token
// @access  Public
router.post(
  '/login',
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists({ checkFalsy: true }),
  async (req, res) => {
    // - validation
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty())
      return res.status(400).json(Object.fromEntries(errors.array()));

    const { email, password } = req.body;
    try {
      //'Invalid Credentials'
      const user = await User.findOne({ email });
      if (!user) return res.status(400).send({ email: 'User not found' });

      const isMatch = await bcryptjs.compare(password, user.password);
      if (!isMatch) return res.status(400).send({ password: 'Wrong password' });

      // log(user);
      // log(user.id);

      const token = jwt.sign({ userId: user.id }, jwtSecret, {
        expiresIn: '2 days',
        //expiresIn: 15,
      });

      res.json({
        token,
        user: {
          _id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
      });
    } catch (err) {
      res.status(500).send({ Error: 'Server error' });
    }
  }
);

// @route   GET api/users/current
// @desc    Get current users
// @access  Private
router.get('/current', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select({
      date: 0,
      password: 0,
    });
    res.json(user);
  } catch (err) {
    res.status(500).send({ Error: 'Server error' });
  }
});

// @route   GET api/users
// @desc    Get all users
// @access  Public
router.get('/', async (req, res) => {
  try {
    const users = await User.find()
      .select('name avatar -_id')
      .sort({ date: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).send({ Error: 'Server error' });
  }
});

export default router;


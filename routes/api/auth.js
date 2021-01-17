const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('config')
const bcrypt = require('bcryptjs')
const moment = require('moment')

const User = require('../../models/User')

// @route   GET api/auth
// @desc    Verify token and get User
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (err) {
    console.log(err)
    res.status(500).send({ msg: 'Server Error' })
  }
})

// @route   POST api/auth
// @desc    Authenticate User and get Token
// @access  Public
router.post(
  '/',
  [
    check('username', 'Username Required').exists(),
    check('password', 'Password Required').exists(),
  ],
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    const { username, password } = req.body

    try {
      // check for existing user
      let user = await User.findOne({ username })

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User does not exists' }] })
      }
      const salt = await bcrypt.genSalt(10)
      const passwordEntered = await bcrypt.hash(password, salt)

      // check if user is active or not...
      if (user.accountStatus !== 'active') {
        return res.status(403).json({
          errors: [
            {
              msg: `Sorry! User is not activated. Inactivated on ${moment(
                user.inactivated_date
              ).format('DD-MMM-YYYY')}`,
            },
          ],
        })
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Password' }] })
      }

      const payload = {
        user: {
          id: user._id,
          name: user.username,
        },
      }

      jwt.sign(
        payload,

        config.get("jwtSecret"),
        { expiresIn: '1d' },

        (err, token) => {
          if (err) throw err
          res.json({ token })
        }
      )
    } catch (err) {
      console.log(err)
      res.status(500).json({ errors: [{ msg: 'Server error' }] })
    }
  }
)

module.exports = router

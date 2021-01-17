const User = require('../models/User')
exports.isAdmin = async (req, res, next) => {
  try {
    let user = await User.findOne({ _id: req.user.id })
      .select('-_id type')
      .lean() // To avoid making hydrated POJO obj...

    // checks if the user is 'Admin'
    if (!(user.systemRole === 'Admin')) {
      return res
        .status(401)
        .json({ msg: 'Access denied. Only Admins are allowed.' })
    }

    next()
  } catch (error) {
    return res.status(500).json({ msg: 'Internal server error.' })
  }
}

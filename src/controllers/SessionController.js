const jwt = require('jsonwebtoken');

const authConfig = require('../../config/auth');
const User = require('../models/Usuario');

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // if (!(await user.checkPassword(password))) {
    //   return res.status(401).json({ error: 'Password does not match' });
    // }

    const { id, nome } = user;

    return res.json({
      user: {
        id,
        nome,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();

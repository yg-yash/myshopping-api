const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.user_signUp = async (req, res) => {
  try {
    const email = await User.findOne({ email: req.body.email });

    if (email) {
      return res.status(409).json({ message: 'Email Already taken' });
    }
    const password = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      email: req.body.email,
      password,
    });
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.user_Login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Auth Failed' });
    }
    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      return res.status(401).json({ message: 'Auth Failed' });
    }
    const token = await jwt.sign(
      {
        email,
        userId: user._id,
      },
      process.env.JWT_KEY, //Your jwt secret here
      {
        expiresIn: '1h',
      }
    );
    res.status(200).json({ message: 'Auth Successful', token });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.user_deleted = async (req, res) => {
  try {
    const _id = req.params.userId;
    await User.deleteOne({ _id });
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    res.status(404).json(error);
  }
};
